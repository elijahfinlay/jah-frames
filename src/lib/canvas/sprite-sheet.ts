import type { ExtractedFrame } from "@/lib/types";

export async function generateSpriteSheet(
  frames: ExtractedFrame[],
  columns: number,
  frameWidth: number
): Promise<Blob> {
  if (frames.length === 0) throw new Error("No frames provided");

  const firstImg = await loadImage(frames[0].url);
  const aspectRatio = firstImg.height / firstImg.width;
  const frameHeight = Math.round(frameWidth * aspectRatio);
  const rows = Math.ceil(frames.length / columns);

  const canvas = document.createElement("canvas");
  canvas.width = columns * frameWidth;
  canvas.height = rows * frameHeight;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "transparent";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < frames.length; i++) {
    const img = await loadImage(frames[i].url);
    const col = i % columns;
    const row = Math.floor(i / columns);
    ctx.drawImage(img, col * frameWidth, row * frameHeight, frameWidth, frameHeight);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to generate sprite sheet"))),
      "image/png"
    );
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
