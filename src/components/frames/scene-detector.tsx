"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";

interface SceneDetectorProps {
  threshold: number;
  onThresholdChange: (v: number) => void;
}

export function SceneDetector({ threshold, onThresholdChange }: SceneDetectorProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Scene Detection</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Lower threshold = more scene changes detected. Higher = only major scene changes.
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Sensitivity</Label>
          <span className="text-xs font-medium text-primary">{threshold.toFixed(2)}</span>
        </div>
        <Slider
          value={[threshold]}
          onValueChange={(v) => onThresholdChange(Array.isArray(v) ? v[0] : v)}
          min={0.1}
          max={0.8}
          step={0.05}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>More scenes</span>
          <span>Fewer scenes</span>
        </div>
      </div>
    </div>
  );
}
