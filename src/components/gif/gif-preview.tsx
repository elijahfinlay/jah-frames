"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatFileSize } from "@/lib/utils/file-utils";
import { downloadBlob } from "@/lib/utils/download-utils";

interface GifPreviewProps {
  url: string;
  blob: Blob;
  filename: string;
}

export function GifPreview({ url, blob, filename }: GifPreviewProps) {
  const handleDownload = () => {
    const name = filename.replace(/\.[^/.]+$/, "") + ".gif";
    downloadBlob(blob, name);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Generated GIF" className="w-full" />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Size: <span className="font-medium text-foreground">{formatFileSize(blob.size)}</span>
        </span>
        <Button onClick={handleDownload} className="gap-2 bg-primary text-primary-foreground">
          <Download className="h-4 w-4" />
          Download GIF
        </Button>
      </div>
    </div>
  );
}
