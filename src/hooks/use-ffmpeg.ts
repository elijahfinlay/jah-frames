"use client";

import { useState, useEffect, useCallback } from "react";
import { getFFmpeg, isFFmpegLoaded } from "@/lib/ffmpeg/ffmpeg-manager";

export function useFFmpeg() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isFFmpegLoaded()) {
      setLoaded(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await getFFmpeg();
      setLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load FFmpeg");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { loaded, loading, error, reload: load };
}
