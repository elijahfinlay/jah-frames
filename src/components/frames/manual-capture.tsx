"use client";

import { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { VideoPreview } from "@/components/shared/video-preview";
import { extractSingleFrame } from "@/lib/ffmpeg/frame-extractor";
import type { ExtractedFrame, ImageFormat } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils/time-utils";
import { toast } from "sonner";

interface ManualCaptureProps {
  videoUrl: string;
  videoFile: File;
  format: ImageFormat;
  quality: number;
  onCapture: (frame: ExtractedFrame) => void;
}

export function ManualCapture({
  videoUrl,
  videoFile,
  format,
  quality,
  onCapture,
}: ManualCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [capturing, setCapturing] = useState(false);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current) return;
    // Read time directly from the video element to avoid stale state after seek
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
  }, [videoFile, format, quality, onCapture]);

  return (
    <div className="space-y-4">
      <VideoPreview
        src={videoUrl}
        videoRef={videoRef}
        onTimeUpdate={setCurrentTime}
        className="aspect-video"
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Current: <span className="font-medium text-foreground">{formatTimestamp(currentTime)}</span>
        </span>
        <Button
          onClick={handleCapture}
          disabled={capturing}
          className="gap-2 bg-primary text-primary-foreground"
        >
          {capturing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          Capture Frame
        </Button>
      </div>
    </div>
  );
}
