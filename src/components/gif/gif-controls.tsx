"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import type { GifSettings } from "@/lib/types";

interface GifControlsProps {
  settings: GifSettings;
  duration: number;
  generating: boolean;
  ffmpegReady: boolean;
  onSettingsChange: (settings: Partial<GifSettings>) => void;
  onGenerate: () => void;
}

export function GifControls({
  settings,
  duration,
  generating,
  ffmpegReady,
  onSettingsChange,
  onGenerate,
}: GifControlsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Start (s)</Label>
          <Input
            type="number"
            step="0.1"
            min={0}
            max={settings.endTime}
            value={settings.startTime}
            onChange={(e) => onSettingsChange({ startTime: parseFloat(e.target.value) || 0 })}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">End (s)</Label>
          <Input
            type="number"
            step="0.1"
            min={settings.startTime}
            max={duration}
            value={settings.endTime}
            onChange={(e) => onSettingsChange({ endTime: parseFloat(e.target.value) || 5 })}
            className="h-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">FPS</Label>
          <span className="text-xs font-medium text-primary">{settings.fps}</span>
        </div>
        <Slider
          value={[settings.fps]}
          onValueChange={(v) => onSettingsChange({ fps: Array.isArray(v) ? v[0] : v })}
          min={5}
          max={30}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Width (px)</Label>
          <span className="text-xs font-medium text-primary">{settings.width}</span>
        </div>
        <Slider
          value={[settings.width]}
          onValueChange={(v) => onSettingsChange({ width: Array.isArray(v) ? v[0] : v })}
          min={120}
          max={1280}
          step={10}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Loop</Label>
        <Switch
          checked={settings.loop}
          onCheckedChange={(loop) => onSettingsChange({ loop })}
        />
      </div>

      <Button
        onClick={onGenerate}
        disabled={generating || !ffmpegReady}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating GIF...
          </>
        ) : !ffmpegReady ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading FFmpeg...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Create GIF
          </>
        )}
      </Button>
    </div>
  );
}
