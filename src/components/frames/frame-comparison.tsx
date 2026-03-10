"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/stores/filter-store";

interface FrameComparisonProps {
  frameUrl: string;
  className?: string;
}

export function FrameComparison({ frameUrl, className }: FrameComparisonProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const { filters } = useFilterStore();

  const filterStyle = {
    filter: [
      `brightness(${filters.brightness}%)`,
      `contrast(${filters.contrast}%)`,
      `saturate(${filters.saturation}%)`,
      filters.blur > 0 ? `blur(${filters.blur}px)` : "",
    ]
      .filter(Boolean)
      .join(" "),
  };

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, x)));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      updatePosition(e.clientX);

      const onMove = (ev: MouseEvent) => updatePosition(ev.clientX);
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [updatePosition]
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative aspect-video cursor-col-resize overflow-hidden rounded-lg", className)}
      onMouseDown={handleMouseDown}
    >
      {/* Original (left side) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={frameUrl} alt="Original" className="absolute inset-0 h-full w-full object-contain" />

      {/* Filtered (right side) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frameUrl}
          alt="Filtered"
          className="h-full w-full object-contain"
          style={filterStyle}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary p-1.5 shadow-lg">
          <div className="h-4 w-4" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
        Original
      </div>
      <div className="absolute right-2 top-2 rounded bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
        Filtered
      </div>
    </div>
  );
}
