"use client";

import { Download, Trash2 } from "lucide-react";
import type { ExtractedFrame } from "@/lib/types";
import { formatFileSize } from "@/lib/utils/file-utils";
import { cn } from "@/lib/utils";

interface FrameCardProps {
  frame: ExtractedFrame;
  index: number;
  isSelected?: boolean;
  onDownload?: () => void;
  onRemove?: () => void;
  onClick?: () => void;
}

export function FrameCard({
  frame,
  index,
  isSelected,
  onDownload,
  onRemove,
  onClick,
}: FrameCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md",
        isSelected ? "border-primary ring-2 ring-primary/30" : "border-border"
      )}
    >
      <div className="aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frame.url}
          alt={`Frame ${index + 1}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
          #{index + 1} &middot; {formatFileSize(frame.blob.size)}
        </span>
        <div className="flex gap-1">
          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="rounded-md bg-primary p-1.5 text-primary-foreground transition-transform hover:scale-110"
            >
              <Download className="h-3 w-3" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="rounded-md bg-destructive p-1.5 text-white transition-transform hover:scale-110"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
