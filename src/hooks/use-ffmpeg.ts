"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getFFmpeg, isFFmpegLoaded } from "@/lib/ffmpeg/ffmpeg-manager";

export function useFFmpeg() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attemptRef = useRef(0);

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
      // Worker errors come back as strings, not Error objects
      const msg = typeof err === "string"
        ? err
        : err instanceof Error
          ? err.message
          : "Failed to load FFmpeg";
      console.error("FFmpeg load error:", msg, err);

      // Auto-retry once on first failure
      if (attemptRef.current === 0) {
        attemptRef.current = 1;
        console.log("Retrying FFmpeg load...");
        try {
          await getFFmpeg();
          setLoaded(true);
          return;
        } catch (retryErr) {
          const retryMsg = typeof retryErr === "string"
            ? retryErr
            : retryErr instanceof Error
              ? retryErr.message
              : "Failed to load FFmpeg";
          console.error("FFmpeg retry failed:", retryMsg, retryErr);
          setError(retryMsg);
        }
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { loaded, loading, error, reload: load };
}
