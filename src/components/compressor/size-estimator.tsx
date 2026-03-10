"use client";

import { formatFileSize } from "@/lib/utils/file-utils";

interface SizeEstimatorProps {
  originalSize: number;
  crf: number;
}

export function SizeEstimator({ originalSize, crf }: SizeEstimatorProps) {
  // Rough estimation based on CRF
  const ratio = Math.pow(0.9, crf - 18);
  const estimated = originalSize * ratio * 0.5;

  return (
    <div className="rounded-lg border border-border bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">Estimated output</p>
      <p className="text-lg font-semibold text-primary">~{formatFileSize(estimated)}</p>
      <p className="text-[10px] text-muted-foreground">
        Original: {formatFileSize(originalSize)} &middot; ~{Math.round((1 - estimated / originalSize) * 100)}% reduction
      </p>
    </div>
  );
}
