"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sun, Contrast, Droplets, CircleDot } from "lucide-react";
import { useFilterStore } from "@/stores/filter-store";

export function FrameFilterPanel() {
  const { filters, setBrightness, setContrast, setSaturation, setBlur, reset, hasChanges } =
    useFilterStore();

  const sliders = [
    { label: "Brightness", icon: Sun, value: filters.brightness, onChange: setBrightness, min: 0, max: 200 },
    { label: "Contrast", icon: Contrast, value: filters.contrast, onChange: setContrast, min: 0, max: 200 },
    { label: "Saturation", icon: Droplets, value: filters.saturation, onChange: setSaturation, min: 0, max: 200 },
    { label: "Blur", icon: CircleDot, value: filters.blur, onChange: setBlur, min: 0, max: 20 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasChanges() && (
          <Button variant="ghost" size="sm" onClick={reset} className="h-7 gap-1 text-xs">
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {sliders.map(({ label, icon: Icon, value, onChange, min, max }) => (
        <div key={label} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-xs">
              <Icon className="h-3 w-3" />
              {label}
            </Label>
            <span className="text-xs font-medium text-primary">
              {label === "Blur" ? `${value}px` : `${value}%`}
            </span>
          </div>
          <Slider
            value={[value]}
            onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
            min={min}
            max={max}
            step={label === "Blur" ? 0.5 : 1}
          />
        </div>
      ))}
    </div>
  );
}
