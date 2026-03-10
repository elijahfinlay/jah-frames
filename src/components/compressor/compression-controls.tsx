"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Minimize2 } from "lucide-react";
import type { CompressionSettings } from "@/lib/types";

interface CompressionControlsProps {
  settings: CompressionSettings;
  compressing: boolean;
  ffmpegReady: boolean;
  onSettingsChange: (settings: Partial<CompressionSettings>) => void;
  onCompress: () => void;
}

export function CompressionControls({
  settings,
  compressing,
  ffmpegReady,
  onSettingsChange,
  onCompress,
}: CompressionControlsProps) {
  return (
    <div className="space-y-5">
      <Tabs
        value={settings.mode}
        onValueChange={(v) => onSettingsChange({ mode: v as "quality" | "target-size" })}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="target-size">Target Size</TabsTrigger>
        </TabsList>

        <TabsContent value="quality" className="mt-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Quality (CRF)</Label>
              <span className="text-sm font-medium text-primary">{settings.crf}</span>
            </div>
            <Slider
              value={[settings.crf]}
              onValueChange={(v) => onSettingsChange({ crf: Array.isArray(v) ? v[0] : v })}
              min={18}
              max={35}
              step={1}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Higher quality / larger</span>
              <span>Lower quality / smaller</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="target-size" className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Target Size (MB)</Label>
            <Input
              type="number"
              min={1}
              max={500}
              value={settings.targetSizeMB}
              onChange={(e) => onSettingsChange({ targetSizeMB: parseInt(e.target.value) || 10 })}
              className="h-9"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-1.5">
        <Label className="text-sm">Speed Preset</Label>
        <Select
          value={settings.preset}
          onValueChange={(v) => onSettingsChange({ preset: v as CompressionSettings["preset"] })}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ultrafast">Ultrafast (lowest quality)</SelectItem>
            <SelectItem value="fast">Fast</SelectItem>
            <SelectItem value="medium">Medium (recommended)</SelectItem>
            <SelectItem value="slow">Slow (best quality)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={onCompress}
        disabled={compressing || !ffmpegReady}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {compressing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Compressing...
          </>
        ) : !ffmpegReady ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading FFmpeg...
          </>
        ) : (
          <>
            <Minimize2 className="h-4 w-4" />
            Compress Video
          </>
        )}
      </Button>
    </div>
  );
}
