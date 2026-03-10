"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  src: string;
  className?: string;
  onTimeUpdate?: (time: number) => void;
  onLoadedMetadata?: (video: HTMLVideoElement) => void;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export function VideoPreview({
  src,
  className,
  onTimeUpdate,
  onLoadedMetadata,
  videoRef: externalRef,
}: VideoPreviewProps) {
  const internalRef = useRef<HTMLVideoElement>(null);
  const ref = externalRef || internalRef;

  // Store callbacks in refs to avoid re-attaching listeners on every render
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onLoadedMetadataRef = useRef(onLoadedMetadata);
  useEffect(() => { onTimeUpdateRef.current = onTimeUpdate; });
  useEffect(() => { onLoadedMetadataRef.current = onLoadedMetadata; });

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const handleTime = () => onTimeUpdateRef.current?.(video.currentTime);
    const handleMeta = () => onLoadedMetadataRef.current?.(video);

    video.addEventListener("timeupdate", handleTime);
    video.addEventListener("loadedmetadata", handleMeta);

    return () => {
      video.removeEventListener("timeupdate", handleTime);
      video.removeEventListener("loadedmetadata", handleMeta);
    };
  }, [ref]);

  return (
    <div className={cn("overflow-hidden rounded-lg bg-black", className)}>
      <video
        ref={ref}
        src={src}
        controls
        className="h-full w-full"
        playsInline
      />
    </div>
  );
}
