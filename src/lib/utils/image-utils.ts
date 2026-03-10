import type { ImageFormat, FilterSettings } from "@/lib/types";
import { getMimeType } from "./file-utils";

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mime = getMimeType(format);
    const q = format === "png" ? undefined : quality / 100;
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob from canvas"));
      },
      mime,
      q
    );
  });
}

export function applyFiltersToCanvas(
  ctx: CanvasRenderingContext2D,
  filters: FilterSettings
) {
  const filterParts: string[] = [];

  if (filters.brightness !== 100) {
    filterParts.push(`brightness(${filters.brightness}%)`);
  }
  if (filters.contrast !== 100) {
    filterParts.push(`contrast(${filters.contrast}%)`);
  }
  if (filters.saturation !== 100) {
    filterParts.push(`saturate(${filters.saturation}%)`);
  }
  if (filters.blur > 0) {
    filterParts.push(`blur(${filters.blur}px)`);
  }

  ctx.filter = filterParts.length > 0 ? filterParts.join(" ") : "none";
}

export function createImageFromBlob(blob: Blob): Promise<{ img: HTMLImageElement; revoke: () => void }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => resolve({ img, revoke: () => URL.revokeObjectURL(url) });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image from blob"));
    };
    img.src = url;
  });
}
