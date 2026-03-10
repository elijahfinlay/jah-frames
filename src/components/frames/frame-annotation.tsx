"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AnnotationSettings } from "@/lib/types";
import { DEFAULT_ANNOTATION_SETTINGS } from "@/lib/constants";

interface FrameAnnotationProps {
  onChange: (settings: AnnotationSettings) => void;
}

export function FrameAnnotation({ onChange }: FrameAnnotationProps) {
  const [settings, setSettings] = useState<AnnotationSettings>({ ...DEFAULT_ANNOTATION_SETTINGS });

  const update = (partial: Partial<AnnotationSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Annotation</h3>

      <div className="space-y-1.5">
        <Label className="text-xs">Text / Watermark</Label>
        <Input
          placeholder="Enter text overlay..."
          value={settings.text}
          onChange={(e) => update({ text: e.target.value })}
          className="h-9"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Font Size</Label>
          <Input
            type="number"
            min={8}
            max={120}
            value={settings.fontSize}
            onChange={(e) => update({ fontSize: parseInt(e.target.value) || 24 })}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <Input
            type="color"
            value={settings.fontColor}
            onChange={(e) => update({ fontColor: e.target.value })}
            className="h-9 cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Position</Label>
        <Select value={settings.position} onValueChange={(v) => update({ position: v as AnnotationSettings["position"] })}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top-left">Top Left</SelectItem>
            <SelectItem value="top-right">Top Right</SelectItem>
            <SelectItem value="bottom-left">Bottom Left</SelectItem>
            <SelectItem value="bottom-right">Bottom Right</SelectItem>
            <SelectItem value="center">Center</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Opacity</Label>
          <span className="text-xs font-medium text-primary">{settings.opacity}%</span>
        </div>
        <Slider
          value={[settings.opacity]}
          onValueChange={(v) => update({ opacity: Array.isArray(v) ? v[0] : v })}
          min={10}
          max={100}
          step={5}
        />
      </div>
    </div>
  );
}
