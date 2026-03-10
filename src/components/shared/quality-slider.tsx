"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { ImageFormat } from "@/lib/types";

interface QualitySliderProps {
  value: number;
  onChange: (value: number) => void;
  format: ImageFormat;
}

export function QualitySlider({ value, onChange, format }: QualitySliderProps) {
  if (format === "png") return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Quality</Label>
        <span className="text-sm font-medium text-primary">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
        min={10}
        max={100}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Smaller file</span>
        <span>Higher quality</span>
      </div>
    </div>
  );
}
