"use client";

import { motion } from "framer-motion";
import type { ExtractedFrame } from "@/lib/types";
import { FrameCard } from "./frame-card";
import { cn } from "@/lib/utils";

interface FrameGalleryProps {
  frames: ExtractedFrame[];
  onDownload?: (frame: ExtractedFrame, index: number) => void;
  onRemove?: (id: string) => void;
  onSelect?: (frame: ExtractedFrame) => void;
  selectedId?: string;
  className?: string;
}

export function FrameGallery({
  frames,
  onDownload,
  onRemove,
  onSelect,
  selectedId,
  className,
}: FrameGalleryProps) {
  if (frames.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", className)}>
      {frames.map((frame, index) => (
        <motion.div
          key={frame.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: Math.min(index * 0.02, 0.5) }}
        >
          <FrameCard
            frame={frame}
            index={index}
            isSelected={selectedId === frame.id}
            onDownload={() => onDownload?.(frame, index)}
            onRemove={() => onRemove?.(frame.id)}
            onClick={() => onSelect?.(frame)}
          />
        </motion.div>
      ))}
    </div>
  );
}
