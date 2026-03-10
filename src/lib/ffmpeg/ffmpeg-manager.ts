import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<void> | null = null;

type ProgressCallback = (progress: number) => void;
type LogCallback = (message: string) => void;

const progressListeners = new Set<ProgressCallback>();
const logListeners = new Set<LogCallback>();

export function onFFmpegProgress(cb: ProgressCallback) {
  progressListeners.add(cb);
  return () => { progressListeners.delete(cb); };
}

export function onFFmpegLog(cb: LogCallback) {
  logListeners.add(cb);
  return () => { logListeners.delete(cb); };
}

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) return ffmpegInstance;

  if (loadPromise) {
    await loadPromise;
    return ffmpegInstance!;
  }

  // Set loadPromise FIRST to prevent concurrent callers from creating duplicates
  loadPromise = (async () => {
    ffmpegInstance = new FFmpeg();

    ffmpegInstance.on("progress", ({ progress }) => {
      progressListeners.forEach((cb) => cb(Math.max(0, Math.min(1, progress))));
    });

    ffmpegInstance.on("log", ({ message }) => {
      logListeners.forEach((cb) => cb(message));
    });

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    try {
      const mtBaseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
      await ffmpegInstance.load({
        coreURL: await toBlobURL(`${mtBaseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${mtBaseURL}/ffmpeg-core.wasm`, "application/wasm"),
        workerURL: await toBlobURL(`${mtBaseURL}/ffmpeg-core.worker.js`, "text/javascript"),
      });
      console.log("FFmpeg loaded (multi-threaded)");
    } catch {
      console.log("Multi-threaded FFmpeg failed, falling back to single-threaded");
      await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      console.log("FFmpeg loaded (single-threaded)");
    }
  })();

  try {
    await loadPromise;
  } catch (err) {
    // Reset so future calls can retry
    loadPromise = null;
    ffmpegInstance = null;
    throw err;
  }

  return ffmpegInstance!;
}

export async function cleanupFS(ffmpeg: FFmpeg, files: string[]) {
  for (const file of files) {
    try {
      await ffmpeg.deleteFile(file);
    } catch {
      // File may not exist, ignore
    }
  }
}

export function isFFmpegLoaded(): boolean {
  return ffmpegInstance?.loaded ?? false;
}
