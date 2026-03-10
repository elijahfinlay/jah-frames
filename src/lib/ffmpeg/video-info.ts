import { getFFmpeg, cleanupFS, onFFmpegLog } from "./ffmpeg-manager";
import { fetchFile } from "@ffmpeg/util";

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps: number;
  codec: string;
  bitrate: number;
}

export async function probeVideoMetadata(file: File): Promise<VideoMetadata> {
  const ffmpeg = await getFFmpeg();
  const inputName = "probe_input" + getExtension(file.name);

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  let logOutput = "";
  // Use module-level listener system which properly returns an unsubscribe function
  const unsub = onFFmpegLog((message) => {
    logOutput += message + "\n";
  });

  try {
    await ffmpeg.exec(["-i", inputName, "-f", "null", "-"]).catch(() => {
      // FFmpeg exits with error when no output specified, but logs contain info
    });
  } finally {
    unsub();
  }

  await cleanupFS(ffmpeg, [inputName]);

  return parseFFmpegLog(logOutput);
}

function parseFFmpegLog(log: string): VideoMetadata {
  let duration = 0;
  let width = 0;
  let height = 0;
  let fps = 30;
  let codec = "unknown";
  let bitrate = 0;

  const durMatch = log.match(/Duration:\s*(\d+):(\d+):(\d+)\.(\d+)/);
  if (durMatch) {
    duration =
      parseInt(durMatch[1]) * 3600 +
      parseInt(durMatch[2]) * 60 +
      parseInt(durMatch[3]) +
      parseInt(durMatch[4]) / 100;
  }

  const videoMatch = log.match(/Video:\s*(\w+).*?(\d{2,5})x(\d{2,5})/);
  if (videoMatch) {
    codec = videoMatch[1];
    width = parseInt(videoMatch[2]);
    height = parseInt(videoMatch[3]);
  }

  const fpsMatch = log.match(/(\d+(?:\.\d+)?)\s*fps/);
  if (fpsMatch) {
    fps = parseFloat(fpsMatch[1]);
  }

  const brMatch = log.match(/bitrate:\s*(\d+)\s*kb\/s/);
  if (brMatch) {
    bitrate = parseInt(brMatch[1]);
  }

  return { duration, width, height, fps, codec, bitrate };
}

function getExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : ".mp4";
}

export function getVideoMetadataFromElement(video: HTMLVideoElement): Partial<VideoMetadata> {
  return {
    duration: video.duration,
    width: video.videoWidth,
    height: video.videoHeight,
  };
}
