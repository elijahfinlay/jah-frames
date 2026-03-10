"use client";

import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";
import { formatFileSize } from "@/lib/utils/file-utils";
import { downloadBlob } from "@/lib/utils/download-utils";
import type { CompressionResult } from "@/lib/types";

interface CompressionResultProps {
  result: CompressionResult;
  filename: string;
}

export function CompressionResultCard({ result, filename }: CompressionResultProps) {
  const handleDownload = () => {
    const name = filename.replace(/\.[^/.]+$/, "") + "_compressed.mp4";
    downloadBlob(result.blob, name);
  };

  return (
    <div className="space-y-4 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <h3 className="font-semibold">Compression Complete</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Original</p>
          <p className="text-sm font-semibold">{formatFileSize(result.originalSize)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Compressed</p>
          <p className="text-sm font-semibold text-primary">{formatFileSize(result.compressedSize)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Reduction</p>
          <p className="text-sm font-semibold text-green-500">{result.reduction}%</p>
        </div>
      </div>

      <Button onClick={handleDownload} className="w-full gap-2 bg-primary text-primary-foreground" size="lg">
        <Download className="h-4 w-4" />
        Download Compressed Video
      </Button>
    </div>
  );
}
