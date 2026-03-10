import { getFFmpeg, cleanupFS, onFFmpegProgress } from "./ffmpeg-manager";
import { fetchFile } from "@ffmpeg/util";

function getFileExt(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : ".mp4";
}

export async function trimVideo(
  file: File,
  startTime: number,
  endTime: number,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; url: string }> {
  const ffmpeg = await getFFmpeg();
  const inputName = "trim_input" + getFileExt(file.name);
  const outputName = "trimmed.mp4";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const unsub = onProgress ? onFFmpegProgress(onProgress) : undefined;

  try {
    await ffmpeg.exec([
      "-ss", startTime.toString(),
      "-i", inputName,
      "-t", (endTime - startTime).toString(),
      "-c", "copy",
      outputName,
    ]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as BlobPart], { type: "video/mp4" });

    return {
      blob,
      url: URL.createObjectURL(blob),
    };
  } finally {
    unsub?.();
    await cleanupFS(ffmpeg, [inputName, outputName]);
  }
}
