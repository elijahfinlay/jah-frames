import type { SceneChange } from "@/lib/types";

export function detectSceneChanges(
  video: HTMLVideoElement,
  threshold: number = 0.3,
  sampleRate: number = 2,
  onProgress?: (progress: number) => void
): Promise<SceneChange[]> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const scenes: SceneChange[] = [];
    let prevHistogram: number[] | null = null;

    const duration = video.duration;
    const sampleInterval = 1 / sampleRate;
    let currentTime = 0;
    let cancelled = false;

    canvas.width = 160;
    canvas.height = 90;

    const processFrame = () => {
      if (cancelled) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const histogram = computeHistogram(imageData);

      if (prevHistogram) {
        const diff = compareHistograms(prevHistogram, histogram);
        if (diff > threshold) {
          scenes.push({ timestamp: currentTime, score: diff });
        }
      }

      prevHistogram = histogram;
      currentTime += sampleInterval;
      onProgress?.(currentTime / duration);

      if (currentTime < duration) {
        video.currentTime = currentTime;
      } else {
        // Clean up the handler when done
        video.onseeked = null;
        resolve(scenes);
      }
    };

    video.onseeked = processFrame;
    video.currentTime = 0;
  });
}

function computeHistogram(imageData: ImageData): number[] {
  const hist = new Array(256).fill(0);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    hist[gray]++;
  }
  const total = data.length / 4;
  return hist.map((v) => v / total);
}

function compareHistograms(a: number[], b: number[]): number {
  let diff = 0;
  for (let i = 0; i < 256; i++) {
    diff += Math.abs(a[i] - b[i]);
  }
  return diff;
}
