"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatTimestamp } from "@/lib/utils/time-utils";

interface TimeRangePickerProps {
  startTime: number;
  endTime: number;
  duration: number;
  onStartChange: (time: number) => void;
  onEndChange: (time: number) => void;
}

export function TimeRangePicker({
  startTime,
  endTime,
  duration,
  onStartChange,
  onEndChange,
}: TimeRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Start Time</Label>
        <Input
          type="number"
          step="0.1"
          min={0}
          max={endTime || duration}
          value={startTime}
          onChange={(e) => onStartChange(parseFloat(e.target.value) || 0)}
          className="h-9"
        />
        <p className="text-[10px] text-muted-foreground">{formatTimestamp(startTime)}</p>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">End Time</Label>
        <Input
          type="number"
          step="0.1"
          min={startTime}
          max={duration}
          value={endTime || duration}
          onChange={(e) => onEndChange(parseFloat(e.target.value) || 0)}
          className="h-9"
        />
        <p className="text-[10px] text-muted-foreground">
          {formatTimestamp(endTime || duration)}
        </p>
      </div>
    </div>
  );
}
