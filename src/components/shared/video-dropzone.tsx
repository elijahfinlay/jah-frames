"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, Film, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { isValidVideoFile, formatFileSize } from "@/lib/utils/file-utils";
import { SUPPORTED_EXTENSIONS } from "@/lib/constants";
import { toast } from "sonner";

interface VideoDropzoneProps {
  onFileSelect: (file: File) => void;
  currentFile?: { name: string; size: number } | null;
  onClear?: () => void;
  className?: string;
  multiple?: boolean;
  onMultipleFiles?: (files: File[]) => void;
}

export function VideoDropzone({
  onFileSelect,
  currentFile,
  onClear,
  className,
  multiple = false,
  onMultipleFiles,
}: VideoDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (multiple && fileArray.length > 1 && onMultipleFiles) {
        const validFiles = fileArray.filter((f) => {
          const result = isValidVideoFile(f);
          if (!result.valid) toast.error(`${f.name}: ${result.error}`);
          return result.valid;
        });
        if (validFiles.length > 0) onMultipleFiles(validFiles);
        return;
      }

      const file = fileArray[0];
      if (!file) return;

      const result = isValidVideoFile(file);
      if (!result.valid) {
        toast.error(result.error);
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect, multiple, onMultipleFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (currentFile) {
    return (
      <div className={cn("relative rounded-xl border border-border bg-card p-4", className)}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Film className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{currentFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(currentFile.size)}</p>
          </div>
          {onClear && (
            <button
              onClick={onClear}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "group relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all sm:p-12",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-accent/50",
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_EXTENSIONS.join(",")}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
        multiple={multiple}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={isDragging ? "dragging" : "idle"}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
              isDragging ? "bg-primary/20" : "bg-muted group-hover:bg-primary/10"
            )}
          >
            <Upload
              className={cn(
                "h-7 w-7 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )}
            />
          </div>

          <div>
            <p className="text-sm font-medium">
              {isDragging ? "Drop your video here" : "Drag & drop a video file"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              or click to browse &middot; MP4, MOV, AVI, WebM, MKV &middot; up to 2GB
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
