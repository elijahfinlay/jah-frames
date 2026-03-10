"use client";

import { useState, useCallback } from "react";
import type { VideoFile } from "@/lib/types";

export function useVideoMetadata() {
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadVideo = useCallback(async (file: File) => {
    setLoading(true);
    const url = URL.createObjectURL(file);

    return new Promise<VideoFile>((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const vf: VideoFile = {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          url,
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          fps: 30, // Default, actual FPS determined by FFmpeg probe
        };
        setVideoFile(vf);
        setLoading(false);
        resolve(vf);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        setLoading(false);
        reject(new Error("Failed to load video metadata"));
      };

      video.src = url;
    });
  }, []);

  const clearVideo = useCallback(() => {
    if (videoFile) {
      URL.revokeObjectURL(videoFile.url);
    }
    setVideoFile(null);
  }, [videoFile]);

  return { videoFile, loading, loadVideo, clearVideo };
}
