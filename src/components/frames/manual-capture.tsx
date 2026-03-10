"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { extractSingleFrame } from "@/lib/ffmpeg/frame-extractor";
import type { ExtractedFrame, ImageFormat } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils/time-utils";
import { toast } from "sonner";

interface ManualCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoFile: File;
  format: ImageFormat;
  quality: number;
  onCapture: (frame: ExtractedFrame) => void;
}

export function ManualCapture({
  videoRef,
  videoFile,
  format,
  quality,
  onCapture,
}: ManualCaptureProps) {
  const [capturing, setCapturing] = useState(false);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current) return;
    const captureTime = videoRef.current.currentTime;
    setCapturing(true);
    try {
      const frame = await extractSingleFrame(videoFile, captureTime, format, quality);
      onCapture(frame);
      toast.success(`Frame captured at ${formatTimestamp(captureTime)}`);
    } catch (err) {
      toast.error("Failed to capture frame");
      console.error(err);
    } finally {
      setCapturing(false);
    }
  }, [videoFile, format, quality, onCapture, videoRef]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Use the video player above to seek to the frame you want, then click capture.
      </p>
      <Button
        onClick={handleCapture}
        disabled={capturing}
        className="w-full gap-2 bg-primary text-primary-foreground"
      >
        {capturing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        Capture Frame
      </Button>
    </div>
  );
}
