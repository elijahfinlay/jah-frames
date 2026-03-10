import type { AnnotationSettings } from "@/lib/types";

export async function applyAnnotation(
  blob: Blob,
  settings: AnnotationSettings
): Promise<Blob> {
  if (!settings.text) return blob;

  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(img, 0, 0);

    ctx.globalAlpha = settings.opacity / 100;
    ctx.fillStyle = settings.fontColor;
    ctx.font = `${settings.fontSize}px system-ui, sans-serif`;
    ctx.textBaseline = "middle";

    const padding = 20;

    let x: number, y: number;
    switch (settings.position) {
      case "top-left":
        x = padding;
        y = padding + settings.fontSize / 2;
        ctx.textAlign = "left";
        break;
      case "top-right":
        x = canvas.width - padding;
        y = padding + settings.fontSize / 2;
        ctx.textAlign = "right";
        break;
      case "bottom-left":
        x = padding;
        y = canvas.height - padding - settings.fontSize / 2;
        ctx.textAlign = "left";
        break;
      case "bottom-right":
        x = canvas.width - padding;
        y = canvas.height - padding - settings.fontSize / 2;
        ctx.textAlign = "right";
        break;
      case "center":
        x = canvas.width / 2;
        y = canvas.height / 2;
        ctx.textAlign = "center";
        break;
    }

    // Text shadow
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(settings.text, x, y);

    ctx.globalAlpha = 1;

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Annotation failed"))),
        "image/png"
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
