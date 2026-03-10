"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatTimestamp } from "@/lib/utils/time-utils";

interface TimelineTrimmerProps {
  duration: number;
  startTime: number;
  endTime: number;
  onStartChange: (time: number) => void;
  onEndChange: (time: number) => void;
  className?: string;
}

export function TimelineTrimmer({
  duration,
  startTime,
  endTime,
  onStartChange,
  onEndChange,
  className,
}: TimelineTrimmerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);

  // Keep live refs to avoid stale closures during native event listeners
  const constraintsRef = useRef({ startTime, endTime: endTime || duration, duration });
  useEffect(() => {
    constraintsRef.current = { startTime, endTime: endTime || duration, duration };
  }, [startTime, endTime, duration]);

  const callbacksRef = useRef({ onStartChange, onEndChange });
  useEffect(() => {
    callbacksRef.current = { onStartChange, onEndChange };
  }, [onStartChange, onEndChange]);

  if (!duration || duration <= 0) return null;

  const effectiveEnd = endTime || duration;
  const startPercent = (startTime / duration) * 100;
  const endPercent = (effectiveEnd / duration) * 100;

  const getTimeFromPosition = (clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(duration, percent * duration));
  };

  const handleMouseDown = (handle: "start" | "end") => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(handle);

    const onMove = (ev: MouseEvent) => {
      const time = getTimeFromPosition(ev.clientX);
      const c = constraintsRef.current;
      if (handle === "start") {
        callbacksRef.current.onStartChange(Math.min(time, c.endTime - 0.1));
      } else {
        callbacksRef.current.onEndChange(Math.max(time, c.startTime + 0.1));
      }
    };

    const onUp = () => {
      setDragging(null);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatTimestamp(startTime)}</span>
        <span>{formatTimestamp(effectiveEnd)}</span>
      </div>

      <div ref={trackRef} className="relative h-8 cursor-pointer rounded-md bg-muted">
        {/* Selected range */}
        <div
          className="absolute top-0 bottom-0 bg-primary/20 rounded-md"
          style={{
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
          }}
        />

        {/* Start handle */}
        <div
          className={cn(
            "absolute top-0 bottom-0 w-3 cursor-col-resize rounded-l-md bg-primary transition-opacity",
            dragging === "start" ? "opacity-100" : "opacity-70 hover:opacity-100"
          )}
          style={{ left: `${startPercent}%` }}
          onMouseDown={handleMouseDown("start")}
        />

        {/* End handle */}
        <div
          className={cn(
            "absolute top-0 bottom-0 w-3 cursor-col-resize rounded-r-md bg-primary transition-opacity",
            dragging === "end" ? "opacity-100" : "opacity-70 hover:opacity-100"
          )}
          style={{ left: `calc(${endPercent}% - 12px)` }}
          onMouseDown={handleMouseDown("end")}
        />
      </div>
    </div>
  );
}
