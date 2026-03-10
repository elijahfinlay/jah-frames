import { SUPPORTED_FORMATS, MAX_FILE_SIZE, SUPPORTED_EXTENSIONS } from "@/lib/constants";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export function isValidVideoFile(file: File): { valid: boolean; error?: string } {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  const isValidType = SUPPORTED_FORMATS.includes(file.type) || SUPPORTED_EXTENSIONS.includes(ext);

  if (!isValidType) {
    return {
      valid: false,
      error: `Unsupported format. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large (${formatFileSize(file.size)}). Maximum: ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  return { valid: true };
}

export function getFileExtension(format: string): string {
  switch (format) {
    case "jpg":
      return "jpg";
    case "webp":
      return "webp";
    default:
      return "png";
  }
}

export function getMimeType(format: string): string {
  switch (format) {
    case "jpg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    default:
      return "image/png";
  }
}
