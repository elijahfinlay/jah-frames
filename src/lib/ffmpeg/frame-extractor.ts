import { getFFmpeg, cleanupFS } from "./ffmpeg-manager";
import { fetchFile } from "@ffmpeg/util";
import type { ExtractionSettings, ExtractedFrame, ImageFormat } from "@/lib/types";
import { FRAME_BATCH_SIZE } from "@/lib/constants";

function getExtension(format: ImageFormat): string {
  switch (format) {
    case "jpg": return "jpg";
    case "webp": return "webp";
    default: return "png";
  }
}

function getFileExt(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : ".mp4";
}

function getMimeForFormat(format: ImageFormat): string {
  switch (format) {
    case "jpg": return "image/jpeg";
    case "webp": return "image/webp";
    default: return "image/png";
  }
}

export async function extractFramesByFPS(
  file: File,
  settings: ExtractionSettings,
  onProgress?: (progress: number, frameCount: number) => void
): Promise<ExtractedFrame[]> {
  const ffmpeg = await getFFmpeg();
  const inputName = "input" + getFileExt(file.name);
  const ext = getExtension(settings.format);

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // -ss BEFORE -i for fast seek
  const args: string[] = [];

  if (settings.startTime > 0) {
    args.push("-ss", settings.startTime.toString());
  }

  args.push("-i", inputName);

  // When -ss is before -i, use -t (duration) instead of -to (absolute)
  if (settings.endTime > 0 && settings.endTime > settings.startTime) {
    const duration = settings.endTime - settings.startTime;
    args.push("-t", duration.toString());
  }

  args.push("-vf", `fps=${settings.fps}`);

  if (settings.format === "jpg") {
    args.push("-q:v", Math.round((100 - settings.quality) / 100 * 31 + 1).toString());
  }

  args.push(`frame_%04d.${ext}`);

  await ffmpeg.exec(args);

  const frames = await collectFrames(ffmpeg, ext, settings.format, onProgress);

  await cleanupFS(ffmpeg, [inputName]);

  return frames;
}

export async function extractFramesByCount(
  file: File,
  settings: ExtractionSettings,
  duration: number,
  onProgress?: (progress: number, frameCount: number) => void
): Promise<ExtractedFrame[]> {
  const ffmpeg = await getFFmpeg();
  const inputName = "input" + getFileExt(file.name);
  const ext = getExtension(settings.format);

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const effectiveStart = settings.startTime;
  const effectiveEnd = settings.endTime > 0 ? settings.endTime : duration;
  const effectiveDuration = effectiveEnd - effectiveStart;
  const interval = effectiveDuration / settings.count;

  // -ss BEFORE -i for fast seek
  const args: string[] = [];

  if (effectiveStart > 0) {
    args.push("-ss", effectiveStart.toString());
  }

  args.push("-i", inputName);

  // When -ss is before -i, use -t (duration) instead of -to
  if (effectiveDuration < duration) {
    args.push("-t", effectiveDuration.toString());
  }

  args.push("-vf", `fps=1/${interval}`);
  args.push("-frames:v", settings.count.toString());

  if (settings.format === "jpg") {
    args.push("-q:v", Math.round((100 - settings.quality) / 100 * 31 + 1).toString());
  }

  args.push(`frame_%04d.${ext}`);

  await ffmpeg.exec(args);

  const frames = await collectFrames(ffmpeg, ext, settings.format, onProgress);

  await cleanupFS(ffmpeg, [inputName]);

  return frames;
}

export async function extractSingleFrame(
  file: File,
  timestamp: number,
  format: ImageFormat,
  quality: number
): Promise<ExtractedFrame> {
  const ffmpeg = await getFFmpeg();
  const inputName = "input" + getFileExt(file.name);
  const ext = getExtension(format);

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const args: string[] = [
    "-ss", timestamp.toString(),
    "-i", inputName,
    "-frames:v", "1",
  ];

  if (format === "jpg") {
    args.push("-q:v", Math.round((100 - quality) / 100 * 31 + 1).toString());
  }

  args.push(`capture.${ext}`);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(`capture.${ext}`);
  const blob = new Blob([data as BlobPart], { type: getMimeForFormat(format) });

  await cleanupFS(ffmpeg, [inputName, `capture.${ext}`]);

  return {
    id: `frame_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    timestamp,
    blob,
    url: URL.createObjectURL(blob),
    width: 0,
    height: 0,
    format,
  };
}

export async function extractFramesByScene(
  file: File,
  settings: ExtractionSettings,
  threshold: number = 0.3,
  onProgress?: (progress: number, frameCount: number) => void
): Promise<ExtractedFrame[]> {
  const ffmpeg = await getFFmpeg();
  const inputName = "input" + getFileExt(file.name);
  const ext = getExtension(settings.format);

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const args: string[] = [];

  if (settings.startTime > 0) {
    args.push("-ss", settings.startTime.toString());
  }

  args.push("-i", inputName);

  if (settings.endTime > 0 && settings.endTime > settings.startTime) {
    const duration = settings.endTime - settings.startTime;
    args.push("-t", duration.toString());
  }

  args.push("-vf", `select='gt(scene,${threshold})',showinfo`);
  args.push("-vsync", "vfr");
  args.push(`frame_%04d.${ext}`);

  await ffmpeg.exec(args);

  const frames = await collectFrames(ffmpeg, ext, settings.format, onProgress);

  await cleanupFS(ffmpeg, [inputName]);

  return frames;
}

async function collectFrames(
  ffmpeg: Awaited<ReturnType<typeof getFFmpeg>>,
  ext: string,
  format: ImageFormat,
  onProgress?: (progress: number, frameCount: number) => void
): Promise<ExtractedFrame[]> {
  const frames: ExtractedFrame[] = [];
  let i = 1;

  while (true) {
    const filename = `frame_${i.toString().padStart(4, "0")}.${ext}`;
    try {
      const data = await ffmpeg.readFile(filename);
      const blob = new Blob([data as BlobPart], { type: getMimeForFormat(format) });
      frames.push({
        id: `frame_${i}_${Date.now()}`,
        timestamp: 0,
        blob,
        url: URL.createObjectURL(blob),
        width: 0,
        height: 0,
        format,
      });
      await ffmpeg.deleteFile(filename);

      // Report frame count (progress is indeterminate since total is unknown)
      onProgress?.(frames.length, frames.length);

      // Yield to main thread every batch
      if (i % FRAME_BATCH_SIZE === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }

      i++;
    } catch {
      break;
    }
  }

  return frames;
}
