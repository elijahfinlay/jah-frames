"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { VideoDropzone } from "@/components/shared/video-dropzone";
import { VideoPreview } from "@/components/shared/video-preview";
import { ProgressBar } from "@/components/shared/progress-bar";
import { CompressionControls } from "@/components/compressor/compression-controls";
import { SizeEstimator } from "@/components/compressor/size-estimator";
import { CompressionResultCard } from "@/components/compressor/compression-result";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { useVideoMetadata } from "@/hooks/use-video-metadata";
import { useCompressorStore } from "@/stores/compressor-store";
import { compressVideo } from "@/lib/ffmpeg/video-compressor";

export default function VideoCompressorPage() {
  const { loaded: ffmpegReady } = useFFmpeg();
  const { videoFile, loadVideo, clearVideo } = useVideoMetadata();
  const store = useCompressorStore();

  const handleFileSelect = useCallback(
    async (file: File) => {
      store.reset();
      try {
        await loadVideo(file);
      } catch {
        toast.error("Failed to load video");
      }
    },
    [loadVideo, store]
  );

  const handleCompress = useCallback(async () => {
    if (!videoFile) return;
    store.setCompressing(true);
    store.setProgress(0);
    try {
      const result = await compressVideo(videoFile.file, store.settings, videoFile.duration, store.setProgress);
      store.setResult(result);
      toast.success(`Compressed! ${result.reduction}% smaller`);
    } catch {
      toast.error("Compression failed");
    } finally {
      store.setCompressing(false);
    }
  }, [videoFile, store]);

  const handleClear = useCallback(() => {
    clearVideo();
    store.reset();
  }, [clearVideo, store]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Minimize2 className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Video Compressor</h1>
        <p className="mt-2 text-muted-foreground">
          Compress videos right in your browser. No upload needed.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <VideoDropzone
                onFileSelect={handleFileSelect}
                currentFile={videoFile ? { name: videoFile.name, size: videoFile.size } : null}
                onClear={handleClear}
              />
            </CardContent>
          </Card>

          {videoFile && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-4">
                  <CompressionControls
                    settings={store.settings}
                    compressing={store.compressing}
                    ffmpegReady={ffmpegReady}
                    onSettingsChange={store.setSettings}
                    onCompress={handleCompress}
                  />
                </CardContent>
              </Card>

              {videoFile && store.settings.mode === "quality" && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <SizeEstimator originalSize={videoFile.size} crf={store.settings.crf} />
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          {videoFile && (
            <Card>
              <CardContent className="p-4">
                <VideoPreview src={videoFile.url} className="aspect-video" />
              </CardContent>
            </Card>
          )}

          {store.compressing && (
            <Card>
              <CardContent className="p-4">
                <ProgressBar progress={store.progress} label="Compressing video..." />
              </CardContent>
            </Card>
          )}

          {store.result && (
            <CompressionResultCard result={store.result} filename={videoFile?.name || "video"} />
          )}
        </div>
      </div>
    </div>
  );
}
