"use client";

import { Download, Archive, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  frameCount: number;
  onDownloadAll: () => void;
  downloading?: boolean;
  progress?: number;
}

export function DownloadButton({
  frameCount,
  onDownloadAll,
  downloading,
  progress = 0,
}: DownloadButtonProps) {
  if (frameCount === 0) return null;

  return (
    <Button
      onClick={onDownloadAll}
      disabled={downloading}
      className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      size="lg"
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Zipping... {Math.round(progress * 100)}%
        </>
      ) : (
        <>
          <Archive className="h-4 w-4" />
          Download All ({frameCount}) as ZIP
        </>
      )}
    </Button>
  );
}
