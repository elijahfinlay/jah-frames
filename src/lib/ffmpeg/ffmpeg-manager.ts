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

const CORE_VERSION = "0.12.10";
const BASE_URL = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/esm`;
const MT_BASE_URL = `https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@${CORE_VERSION}/dist/esm`;

function setupListeners(ffmpeg: FFmpeg) {
  ffmpeg.on("progress", ({ progress }) => {
    progressListeners.forEach((cb) => cb(Math.max(0, Math.min(1, progress))));
  });
  ffmpeg.on("log", ({ message }) => {
    logListeners.forEach((cb) => cb(message));
  });
}

async function getClassWorkerURL(): Promise<string> {
  // Fetch our self-contained worker from public/ and create a blob URL.
  // This avoids Turbopack/webpack failing to resolve the worker from
  // inside node_modules/@ffmpeg/ffmpeg when it analyzes new URL() patterns.
  const resp = await fetch("/ffmpeg-worker.js");
  const text = await resp.text();
  const blob = new Blob([text], { type: "text/javascript" });
  return URL.createObjectURL(blob);
}

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) return ffmpegInstance;

  if (loadPromise) {
    await loadPromise;
    return ffmpegInstance!;
  }

  loadPromise = (async () => {
    const classWorkerURL = await getClassWorkerURL();

    // Try multi-threaded first (requires SharedArrayBuffer / crossOriginIsolated)
    if (typeof window !== "undefined" && window.crossOriginIsolated) {
      try {
        console.log("FFmpeg: attempting multi-threaded load...");
        const inst = new FFmpeg();
        setupListeners(inst);
        const coreURL = await toBlobURL(`${MT_BASE_URL}/ffmpeg-core.js`, "text/javascript");
        const wasmURL = await toBlobURL(`${MT_BASE_URL}/ffmpeg-core.wasm`, "application/wasm");
        const workerURL = await toBlobURL(`${MT_BASE_URL}/ffmpeg-core.worker.js`, "text/javascript");
        await inst.load({ classWorkerURL, coreURL, wasmURL, workerURL });
        ffmpegInstance = inst;
        console.log("FFmpeg loaded (multi-threaded)");
        return;
      } catch (err) {
        console.warn("Multi-threaded FFmpeg failed, trying single-threaded:", err);
      }
    }

    // Fallback: single-threaded (fresh instance)
    console.log("FFmpeg: attempting single-threaded load...");
    const inst = new FFmpeg();
    setupListeners(inst);
    const coreURL = await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript");
    const wasmURL = await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, "application/wasm");
    await inst.load({ classWorkerURL, coreURL, wasmURL });
    ffmpegInstance = inst;
    console.log("FFmpeg loaded (single-threaded)");
  })();

  try {
    await loadPromise;
  } catch (err) {
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
