// Web Worker for scene detection histogram comparison
// Used to offload heavy computation from the main thread

interface WorkerMessage {
  type: "detect";
  imageData: ImageData;
  frameIndex: number;
}

let prevHistogram: number[] | null = null;

function computeHistogram(data: Uint8ClampedArray): number[] {
  const hist = new Array(256).fill(0);
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

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  if (e.data.type === "detect") {
    const histogram = computeHistogram(e.data.imageData.data);
    let score = 0;

    if (prevHistogram) {
      score = compareHistograms(prevHistogram, histogram);
    }

    prevHistogram = histogram;

    self.postMessage({
      frameIndex: e.data.frameIndex,
      score,
    });
  }
};
