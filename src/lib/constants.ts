export const SUPPORTED_FORMATS = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  "video/x-matroska",
];

export const SUPPORTED_EXTENSIONS = [".mp4", ".mov", ".avi", ".webm", ".mkv"];

export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
export const MEMORY_WARNING_THRESHOLD = 500 * 1024 * 1024; // 500MB
export const MAX_FRAMES_MOBILE = 200;
export const FRAME_BATCH_SIZE = 50;

export const DEFAULT_EXTRACTION_SETTINGS = {
  mode: "fps" as const,
  fps: 1,
  count: 10,
  startTime: 0,
  endTime: 0,
  format: "png" as const,
  quality: 92,
};

export const DEFAULT_FILTER_SETTINGS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
};

export const DEFAULT_COMPRESSION_SETTINGS = {
  mode: "quality" as const,
  crf: 23,
  targetSizeMB: 10,
  preset: "medium" as const,
};

export const DEFAULT_GIF_SETTINGS = {
  fps: 10,
  width: 480,
  loop: true,
  startTime: 0,
  endTime: 5,
};

export const DEFAULT_CONTACT_SHEET_SETTINGS = {
  columns: 4,
  rows: 4,
  frameWidth: 320,
  showTimestamps: true,
  showHeader: true,
  backgroundColor: "#1c1917",
  textColor: "#fafaf9",
};

export const DEFAULT_ANNOTATION_SETTINGS = {
  text: "",
  fontSize: 24,
  fontColor: "#ffffff",
  position: "bottom-right" as const,
  opacity: 80,
};

export const IMAGE_FORMAT_OPTIONS = [
  { value: "png", label: "PNG", description: "Lossless, larger files" },
  { value: "jpg", label: "JPG", description: "Smaller files, slight quality loss" },
  { value: "webp", label: "WebP", description: "Modern format, best compression" },
] as const;
