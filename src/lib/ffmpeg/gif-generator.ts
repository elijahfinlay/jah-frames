import { getFFmpeg, cleanupFS } from "./ffmpeg-manager";
import { fetchFile } from "@ffmpeg/util";
import type { GifSettings } from "@/lib/types";

function getFileExt(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : ".mp4";
}

export async function generateGif(
  file: File,
  settings: GifSettings,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; url: string }> {
  const ffmpeg = await getFFmpeg();
  const inputName = "gif_input" + getFileExt(file.name);
  const paletteName = "palette.png";
  const outputName = "output.gif";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const filters = `fps=${settings.fps},scale=${settings.width}:-1:flags=lanczos`;

  // Pass 1: Generate palette
  onProgress?.(0.1);
  await ffmpeg.exec([
    "-ss", settings.startTime.toString(),
    "-t", (settings.endTime - settings.startTime).toString(),
    "-i", inputName,
    "-vf", `${filters},palettegen=stats_mode=diff`,
    "-y", paletteName,
  ]);

  // Pass 2: Generate GIF using palette
  onProgress?.(0.4);
  const loopFlag = settings.loop ? "0" : "-1";
  await ffmpeg.exec([
    "-ss", settings.startTime.toString(),
    "-t", (settings.endTime - settings.startTime).toString(),
    "-i", inputName,
    "-i", paletteName,
    "-lavfi", `${filters}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5`,
    "-loop", loopFlag,
    "-y", outputName,
  ]);

  onProgress?.(0.9);

  const data = await ffmpeg.readFile(outputName);
  const blob = new Blob([data as BlobPart], { type: "image/gif" });

  await cleanupFS(ffmpeg, [inputName, paletteName, outputName]);

  onProgress?.(1);

  return {
    blob,
    url: URL.createObjectURL(blob),
  };
}
