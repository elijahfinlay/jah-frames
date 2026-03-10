"use client";

import type { ImageFormat } from "@/lib/types";
import { IMAGE_FORMAT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FormatSelectorProps {
  value: ImageFormat;
  onChange: (format: ImageFormat) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="flex gap-2">
      {IMAGE_FORMAT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value as ImageFormat)}
          className={cn(
            "flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium transition-all",
            value === opt.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
          )}
        >
          <div>{opt.label}</div>
          <div className="mt-0.5 text-[10px] font-normal opacity-70">{opt.description}</div>
        </button>
      ))}
    </div>
  );
}
