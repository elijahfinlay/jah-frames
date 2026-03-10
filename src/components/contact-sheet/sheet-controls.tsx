"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Grid3X3 } from "lucide-react";
import type { ContactSheetSettings } from "@/lib/types";

interface SheetControlsProps {
  settings: ContactSheetSettings;
  onSettingsChange: (settings: Partial<ContactSheetSettings>) => void;
  frameCount: number;
  generating: boolean;
  onGenerate: () => void;
}

export function SheetControls({
  settings,
  onSettingsChange,
  frameCount,
  generating,
  onGenerate,
}: SheetControlsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Columns</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={settings.columns}
            onChange={(e) => onSettingsChange({ columns: parseInt(e.target.value) || 4 })}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Frame Width (px)</Label>
          <Input
            type="number"
            min={100}
            max={800}
            value={settings.frameWidth}
            onChange={(e) => onSettingsChange({ frameWidth: parseInt(e.target.value) || 320 })}
            className="h-9"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Timestamps</Label>
          <Switch
            checked={settings.showTimestamps}
            onCheckedChange={(showTimestamps) => onSettingsChange({ showTimestamps })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Header</Label>
          <Switch
            checked={settings.showHeader}
            onCheckedChange={(showHeader) => onSettingsChange({ showHeader })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Background</Label>
          <Input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
            className="h-9 cursor-pointer"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Text Color</Label>
          <Input
            type="color"
            value={settings.textColor}
            onChange={(e) => onSettingsChange({ textColor: e.target.value })}
            className="h-9 cursor-pointer"
          />
        </div>
      </div>

      <Button
        onClick={onGenerate}
        disabled={generating || frameCount === 0}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Grid3X3 className="h-4 w-4" />
            Generate Sheet ({frameCount} frames)
          </>
        )}
      </Button>
    </div>
  );
}
