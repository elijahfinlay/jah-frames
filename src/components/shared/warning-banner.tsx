"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WarningBannerProps {
  message: string;
  className?: string;
}

export function WarningBanner({ message, className }: WarningBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
      <p className="text-sm text-yellow-600 dark:text-yellow-400">{message}</p>
    </div>
  );
}
