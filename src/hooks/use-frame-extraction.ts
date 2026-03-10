"use client";

import { useState, useCallback } from "react";
import type { ExtractionSettings, ExtractedFrame, VideoFile } from "@/lib/types";
import {
  extractFramesByFPS,
  extractFramesByCount,
  extractFramesByScene,
} from "@/lib/ffmpeg/frame-extractor";

export function useFrameExtraction() {
  const [frames, setFrames] = useState<ExtractedFrame[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [frameCount, setFrameCount] = useState(0);

  const extract = useCallback(
    async (video: VideoFile, settings: ExtractionSettings) => {
      setExtracting(true);
      setProgress(0);
      setFrameCount(0);
      setFrames([]);

      const onProgress = (p: number, count: number) => {
        setProgress(p);
        setFrameCount(count);
      };

      try {
        let result: ExtractedFrame[];

        switch (settings.mode) {
          case "fps":
            result = await extractFramesByFPS(video.file, settings, onProgress);
            break;
          case "count":
            result = await extractFramesByCount(
              video.file,
              settings,
              video.duration,
              onProgress
            );
            break;
          case "scene":
            result = await extractFramesByScene(video.file, settings, 0.3, onProgress);
            break;
          default:
            result = [];
        }

        setFrames(result);
        setProgress(1);
        return result;
      } catch (err) {
        console.error("Extraction failed:", err);
        throw err;
      } finally {
        setExtracting(false);
      }
    },
    []
  );

  const clearFrames = useCallback(() => {
    frames.forEach((f) => URL.revokeObjectURL(f.url));
    setFrames([]);
    setFrameCount(0);
    setProgress(0);
  }, [frames]);

  const removeFrame = useCallback((id: string) => {
    setFrames((prev) => {
      const frame = prev.find((f) => f.id === id);
      if (frame) URL.revokeObjectURL(frame.url);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  return {
    frames,
    extracting,
    progress,
    frameCount,
    extract,
    clearFrames,
    removeFrame,
    setFrames,
  };
}
