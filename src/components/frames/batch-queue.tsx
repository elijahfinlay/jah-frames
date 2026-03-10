"use client";

import { useBatchStore } from "@/stores/batch-store";
import { formatFileSize } from "@/lib/utils/file-utils";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";

export function BatchQueue() {
  const { items, removeItem, clearAll } = useBatchStore();

  if (items.length === 0) return null;

  const statusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "done":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Batch Queue ({items.length} video{items.length !== 1 ? "s" : ""})
        </h3>
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
          Clear All
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-md border border-border bg-background p-2"
          >
            {statusIcon(item.status)}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{item.file.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {formatFileSize(item.file.size)}
                {item.status === "done" && ` — ${item.frames.length} frames`}
                {item.error && ` — ${item.error}`}
              </p>
              {item.status === "processing" && (
                <ProgressBar progress={item.progress} className="mt-1" showPercentage={false} />
              )}
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
