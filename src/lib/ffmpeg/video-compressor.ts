import { getFFmpeg, cleanupFS, onFFmpegProgress } from "./ffmpeg-manager";
import { fetchFile } from "@ffmpeg/util";
import type { CompressionSettings, CompressionResult } from "@/lib/types";

function getFileExt(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : ".mp4";
}

export async function compressVideo(
  file: File,
  settings: CompressionSettings,
  duration: number,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const ffmpeg = await getFFmpeg();
  const inputName = "compress_input" + getFileExt(file.name);
  const outputName = "compressed_output.mp4";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // Use the module-level listener system to avoid stacking listeners on the singleton
  const unsub = onProgress ? onFFmpegProgress(onProgress) : undefined;

  const args: string[] = ["-i", inputName];

  if (settings.mode === "quality") {
    args.push(
      "-c:v", "libx264",
      "-crf", settings.crf.toString(),
      "-preset", settings.preset,
      "-c:a", "aac",
      "-b:a", "128k",
      outputName
    );
  } else {
    // Target size mode: calculate bitrate from actual duration
    const effectiveDuration = Math.max(duration, 1);
    const targetBits = settings.targetSizeMB * 8 * 1024 * 1024;
    const audioBitrate = 128000;
    const videoBitrate = Math.floor(targetBits / effectiveDuration - audioBitrate);

    args.push(
      "-c:v", "libx264",
      "-b:v", `${Math.max(videoBitrate, 100000)}`,
      "-preset", settings.preset,
      "-c:a", "aac",
      "-b:a", "128k",
      outputName
    );
  }

  try {
    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as BlobPart], { type: "video/mp4" });

    return {
      blob,
      url: URL.createObjectURL(blob),
      originalSize: file.size,
      compressedSize: blob.size,
      reduction: Math.round((1 - blob.size / file.size) * 100),
    };
  } finally {
    unsub?.();
    await cleanupFS(ffmpeg, [inputName, outputName]);
  }
}
