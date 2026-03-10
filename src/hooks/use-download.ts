"use client";

import { useState, useCallback } from "react";
import type { ExtractedFrame, ImageFormat } from "@/lib/types";
import { downloadFrame, downloadAllFramesAsZip } from "@/lib/utils/download-utils";

export function useDownload() {
  const [downloading, setDownloading] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const downloadSingle = useCallback(
    (frame: ExtractedFrame, videoName: string, index: number) => {
      downloadFrame(frame, videoName, index);
    },
    []
  );

  const downloadZip = useCallback(
    async (frames: ExtractedFrame[], videoName: string, format: ImageFormat) => {
      setDownloading(true);
      setZipProgress(0);
      try {
        await downloadAllFramesAsZip(frames, videoName, format, setZipProgress);
      } finally {
        setDownloading(false);
        setZipProgress(0);
      }
    },
    []
  );

  return { downloading, zipProgress, downloadSingle, downloadZip };
}
