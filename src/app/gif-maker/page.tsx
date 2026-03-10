"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { VideoDropzone } from "@/components/shared/video-dropzone";
import { VideoPreview } from "@/components/shared/video-preview";
import { ProgressBar } from "@/components/shared/progress-bar";
import { GifControls } from "@/components/gif/gif-controls";
import { GifPreview } from "@/components/gif/gif-preview";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { useVideoMetadata } from "@/hooks/use-video-metadata";
import { useGifStore } from "@/stores/gif-store";
import { generateGif } from "@/lib/ffmpeg/gif-generator";

export default function GifMakerPage() {
  const { loaded: ffmpegReady } = useFFmpeg();
  const { videoFile, loadVideo, clearVideo } = useVideoMetadata();
  const store = useGifStore();

  const handleFileSelect = useCallback(
    async (file: File) => {
      store.reset();
      try {
        const vf = await loadVideo(file);
        store.setSettings({ endTime: Math.min(5, vf.duration) });
      } catch {
        toast.error("Failed to load video");
      }
    },
    [loadVideo, store]
  );

  const handleGenerate = useCallback(async () => {
    if (!videoFile) return;
    store.setGenerating(true);
    store.setProgress(0);
    try {
      const result = await generateGif(videoFile.file, store.settings, store.setProgress);
      store.setResult(result.url, result.blob);
      toast.success("GIF created!");
    } catch {
      toast.error("GIF generation failed");
    } finally {
      store.setGenerating(false);
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
          <Film className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">GIF Maker</h1>
        <p className="mt-2 text-muted-foreground">
          Create animated GIFs from any video segment. High-quality palette optimization.
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
                  <GifControls
                    settings={store.settings}
                    duration={videoFile.duration}
                    generating={store.generating}
                    ffmpegReady={ffmpegReady}
                    onSettingsChange={store.setSettings}
                    onGenerate={handleGenerate}
                  />
                </CardContent>
              </Card>
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

          {store.generating && (
            <Card>
              <CardContent className="p-4">
                <ProgressBar progress={store.progress} label="Generating GIF..." />
              </CardContent>
            </Card>
          )}

          {store.resultUrl && store.resultBlob && (
            <Card>
              <CardContent className="p-4">
                <GifPreview
                  url={store.resultUrl}
                  blob={store.resultBlob}
                  filename={videoFile?.name || "video"}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
