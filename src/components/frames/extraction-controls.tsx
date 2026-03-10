"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FormatSelector } from "@/components/shared/format-selector";
import { QualitySlider } from "@/components/shared/quality-slider";
import { TimeRangePicker } from "@/components/shared/time-range-picker";
import { Play, Loader2 } from "lucide-react";
import type { ExtractionMode, ExtractionSettings } from "@/lib/types";

interface ExtractionControlsProps {
  settings: ExtractionSettings;
  duration: number;
  extracting: boolean;
  ffmpegReady: boolean;
  ffmpegError?: string | null;
  onModeChange: (mode: ExtractionMode) => void;
  onFpsChange: (fps: number) => void;
  onCountChange: (count: number) => void;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  onFormatChange: (format: "png" | "jpg" | "webp") => void;
  onQualityChange: (quality: number) => void;
  onExtract: () => void;
}

export function ExtractionControls({
  settings,
  duration,
  extracting,
  ffmpegReady,
  ffmpegError,
  onModeChange,
  onFpsChange,
  onCountChange,
  onStartTimeChange,
  onEndTimeChange,
  onFormatChange,
  onQualityChange,
  onExtract,
}: ExtractionControlsProps) {
  return (
    <div className="space-y-5">
      <Tabs value={settings.mode} onValueChange={(v) => onModeChange(v as ExtractionMode)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fps">By FPS</TabsTrigger>
          <TabsTrigger value="count">By Count</TabsTrigger>
          <TabsTrigger value="scene">Scene Detect</TabsTrigger>
        </TabsList>

        <TabsContent value="fps" className="mt-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Frames per Second</Label>
              <span className="text-sm font-medium text-primary">{settings.fps}</span>
            </div>
            <Slider
              value={[settings.fps]}
              onValueChange={(v) => onFpsChange(Array.isArray(v) ? v[0] : v)}
              min={0.1}
              max={30}
              step={0.1}
            />
            <p className="text-[10px] text-muted-foreground">
              ~{Math.ceil((duration || 10) * settings.fps)} frames estimated
            </p>
          </div>
        </TabsContent>

        <TabsContent value="count" className="mt-4 space-y-3">
          <div className="space-y-2">
            <Label className="text-sm">Number of Frames</Label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={settings.count}
              onChange={(e) => onCountChange(parseInt(e.target.value) || 1)}
              className="h-9"
            />
          </div>
        </TabsContent>

        <TabsContent value="scene" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Automatically detect scene changes and extract one frame per scene. Best for
            extracting key moments from videos.
          </p>
        </TabsContent>
      </Tabs>

      <TimeRangePicker
        startTime={settings.startTime}
        endTime={settings.endTime}
        duration={duration}
        onStartChange={onStartTimeChange}
        onEndChange={onEndTimeChange}
      />

      <FormatSelector value={settings.format} onChange={onFormatChange} />

      <QualitySlider
        value={settings.quality}
        onChange={onQualityChange}
        format={settings.format}
      />

      {ffmpegError && (
        <p className="text-sm text-destructive">
          FFmpeg failed to load: {ffmpegError}. Try refreshing the page.
        </p>
      )}

      <Button
        onClick={onExtract}
        disabled={extracting || !ffmpegReady}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {extracting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Extracting...
          </>
        ) : ffmpegError ? (
          <>FFmpeg Error — Refresh Page</>
        ) : !ffmpegReady ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading FFmpeg...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Extract Frames
          </>
        )}
      </Button>
    </div>
  );
}
