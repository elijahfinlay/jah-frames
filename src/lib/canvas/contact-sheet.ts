import type { ContactSheetSettings, ExtractedFrame } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils/time-utils";

export async function generateContactSheet(
  frames: ExtractedFrame[],
  settings: ContactSheetSettings,
  videoName: string,
  duration: number
): Promise<Blob> {
  if (frames.length === 0) throw new Error("No frames provided");

  const { columns, frameWidth, showTimestamps, showHeader, backgroundColor, textColor } = settings;

  // Get actual aspect ratio from first frame
  const firstImg = await loadImage(frames[0].url);
  const aspectRatio = firstImg.height / firstImg.width;
  const frameHeight = Math.round(frameWidth * aspectRatio);

  const rows = Math.ceil(frames.length / columns);
  const padding = 8;
  const headerHeight = showHeader ? 60 : 0;
  const timestampHeight = showTimestamps ? 20 : 0;

  const totalWidth = columns * (frameWidth + padding) + padding;
  const totalHeight =
    headerHeight + rows * (frameHeight + timestampHeight + padding) + padding;

  const canvas = document.createElement("canvas");
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Header
  if (showHeader) {
    ctx.fillStyle = textColor;
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(videoName, padding, 28);
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillStyle = textColor + "99";
    ctx.fillText(
      `${frames.length} frames | Duration: ${formatTimestamp(duration)} | ${columns}x${rows} grid`,
      padding,
      48
    );
  }

  // Frames
  for (let i = 0; i < frames.length; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = padding + col * (frameWidth + padding);
    const y = headerHeight + padding + row * (frameHeight + timestampHeight + padding);

    const img = await loadImage(frames[i].url);
    ctx.drawImage(img, x, y, frameWidth, frameHeight);

    if (showTimestamps) {
      ctx.fillStyle = textColor + "cc";
      ctx.font = "11px system-ui, monospace";
      ctx.fillText(
        formatTimestamp(frames[i].timestamp || (i * duration) / frames.length),
        x + 4,
        y + frameHeight + 14
      );
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to generate contact sheet"))),
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
