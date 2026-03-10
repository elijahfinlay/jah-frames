export interface VideoFile {
  file: File;
  name: string;
  size: number;
  type: string;
  url: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
}

export interface ExtractedFrame {
  id: string;
  timestamp: number;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  format: ImageFormat;
  filtered?: boolean;
}

export type ImageFormat = "png" | "jpg" | "webp";

export type ExtractionMode = "fps" | "count" | "manual" | "scene";

export interface ExtractionSettings {
  mode: ExtractionMode;
  fps: number;
  count: number;
  startTime: number;
  endTime: number;
  format: ImageFormat;
  quality: number;
}

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

export interface CompressionSettings {
  mode: "quality" | "target-size";
  crf: number;
  targetSizeMB: number;
  preset: "ultrafast" | "fast" | "medium" | "slow";
}

export interface CompressionResult {
  blob: Blob;
  url: string;
  originalSize: number;
  compressedSize: number;
  reduction: number;
}

export interface GifSettings {
  fps: number;
  width: number;
  loop: boolean;
  startTime: number;
  endTime: number;
}

export interface ContactSheetSettings {
  columns: number;
  rows: number;
  frameWidth: number;
  showTimestamps: boolean;
  showHeader: boolean;
  backgroundColor: string;
  textColor: string;
}

export interface BatchItem {
  id: string;
  file: File;
  status: "queued" | "processing" | "done" | "error";
  progress: number;
  frames: ExtractedFrame[];
  error?: string;
}

export interface SceneChange {
  timestamp: number;
  score: number;
}

export interface AnnotationSettings {
  text: string;
  fontSize: number;
  fontColor: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  opacity: number;
}
