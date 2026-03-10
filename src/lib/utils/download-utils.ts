import type { ExtractedFrame, ImageFormat } from "@/lib/types";
import { getFileExtension } from "./file-utils";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadFrame(frame: ExtractedFrame, videoName: string, index: number) {
  const ext = getFileExtension(frame.format);
  const baseName = videoName.replace(/\.[^/.]+$/, "");
  const filename = `${baseName}_frame_${(index + 1).toString().padStart(4, "0")}.${ext}`;
  downloadBlob(frame.blob, filename);
}

export function downloadAllFramesAsZip(
  frames: ExtractedFrame[],
  videoName: string,
  format: ImageFormat,
  onProgress?: (progress: number) => void
): Promise<void> {
  return import("jszip").then(async ({ default: JSZip }) => {
    const zip = new JSZip();
    const ext = getFileExtension(format);
    const baseName = videoName.replace(/\.[^/.]+$/, "");
    const folder = zip.folder(`${baseName}_frames`)!;

    frames.forEach((frame, i) => {
      const filename = `frame_${(i + 1).toString().padStart(4, "0")}.${ext}`;
      folder.file(filename, frame.blob);
      onProgress?.((i + 1) / frames.length * 0.5);
    });

    const content = await zip.generateAsync(
      { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
      (meta) => onProgress?.(0.5 + meta.percent / 200)
    );

    downloadBlob(content, `${baseName}_frames.zip`);
    onProgress?.(1);
  });
}
