"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Grid3X3 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { VideoDropzone } from "@/components/shared/video-dropzone";
import { VideoPreview } from "@/components/shared/video-preview";
import { FrameGallery } from "@/components/shared/frame-gallery";
import { ProgressBar } from "@/components/shared/progress-bar";
import { ExtractionControls } from "@/components/frames/extraction-controls";
import { SheetControls } from "@/components/contact-sheet/sheet-controls";
import { SheetPreview } from "@/components/contact-sheet/sheet-preview";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { useVideoMetadata } from "@/hooks/use-video-metadata";
import { useFrameExtraction } from "@/hooks/use-frame-extraction";
import { useExtractionStore } from "@/stores/extraction-store";
import { generateContactSheet } from "@/lib/canvas/contact-sheet";
import { DEFAULT_CONTACT_SHEET_SETTINGS } from "@/lib/constants";
import type { ContactSheetSettings } from "@/lib/types";

export default function ContactSheetPage() {
  const { loaded: ffmpegReady, error: ffmpegError } = useFFmpeg();
  const { videoFile, loadVideo, clearVideo } = useVideoMetadata();
  const { frames, extracting, progress, frameCount, extract, clearFrames } =
    useFrameExtraction();
  const store = useExtractionStore();
  const [sheetSettings, setSheetSettings] = useState<ContactSheetSettings>({
    ...DEFAULT_CONTACT_SHEET_SETTINGS,
  });
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [sheetBlob, setSheetBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);
  const sheetUrlRef = useRef(sheetUrl);
  sheetUrlRef.current = sheetUrl;

  // Revoke blob URL on unmount
  useEffect(() => {
    return () => {
      if (sheetUrlRef.current) URL.revokeObjectURL(sheetUrlRef.current);
    };
  }, []);

  const handleFileSelect = useCallback(
    async (file: File) => {
      clearFrames();
      setSheetUrl(null);
      try {
        const vf = await loadVideo(file);
        store.setEndTime(vf.duration);
        store.setCount(16);
      } catch {
        toast.error("Failed to load video");
      }
    },
    [loadVideo, clearFrames, store]
  );

  const handleExtract = useCallback(async () => {
    if (!videoFile) return;
    try {
      await extract(videoFile, store.settings);
      toast.success("Frames extracted! Now generate your sheet.");
    } catch {
      toast.error("Extraction failed");
    }
  }, [videoFile, extract, store.settings]);

  const handleGenerateSheet = useCallback(async () => {
    if (frames.length === 0) return;
    setGenerating(true);
    try {
      const blob = await generateContactSheet(
        frames,
        sheetSettings,
        videoFile?.name || "video",
        videoFile?.duration || 0
      );
      if (sheetUrl) URL.revokeObjectURL(sheetUrl);
      const url = URL.createObjectURL(blob);
      setSheetUrl(url);
      setSheetBlob(blob);
      toast.success("Contact sheet generated!");
    } catch {
      toast.error("Failed to generate sheet");
    } finally {
      setGenerating(false);
    }
  }, [frames, sheetSettings, videoFile, sheetUrl]);

  const handleClear = useCallback(() => {
    clearVideo();
    clearFrames();
    store.reset();
    if (sheetUrl) URL.revokeObjectURL(sheetUrl);
    setSheetUrl(null);
    setSheetBlob(null);
  }, [clearVideo, clearFrames, store, sheetUrl]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Grid3X3 className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Sheet</h1>
        <p className="mt-2 text-muted-foreground">
          Generate a visual overview of your video with timestamps and metadata.
        </p>
      </motion.div>

      {!videoFile && (
        <div className="mx-auto max-w-xl">
          <VideoDropzone onFileSelect={handleFileSelect} />
        </div>
      )}

      {videoFile && (
      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <VideoDropzone
                onFileSelect={handleFileSelect}
                currentFile={{ name: videoFile.name, size: videoFile.size }}
                onClear={handleClear}
              />
            </CardContent>
          </Card>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-3 text-sm font-semibold">1. Extract Frames</h3>
                <ExtractionControls
                  settings={store.settings}
                  duration={videoFile.duration}
                  extracting={extracting}
                  ffmpegReady={ffmpegReady}
                  ffmpegError={ffmpegError}
                  onModeChange={store.setMode}
                  onFpsChange={store.setFps}
                  onCountChange={store.setCount}
                  onStartTimeChange={store.setStartTime}
                  onEndTimeChange={store.setEndTime}
                  onFormatChange={store.setFormat}
                  onQualityChange={store.setQuality}
                  onExtract={handleExtract}
                />
              </CardContent>
            </Card>

            {frames.length > 0 && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h3 className="mb-3 text-sm font-semibold">2. Sheet Settings</h3>
                  <SheetControls
                    settings={sheetSettings}
                    onSettingsChange={(partial) =>
                      setSheetSettings((prev) => ({ ...prev, ...partial }))
                    }
                    frameCount={frames.length}
                    generating={generating}
                    onGenerate={handleGenerateSheet}
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <VideoPreview src={videoFile.url} className="aspect-video" />
            </CardContent>
          </Card>

          {extracting && (
            <Card>
              <CardContent className="p-4">
                <ProgressBar
                  progress={progress}
                  label={`Extracting frames... (${frameCount} found)`}
                />
              </CardContent>
            </Card>
          )}

          {frames.length > 0 && !sheetUrl && (
            <FrameGallery frames={frames} />
          )}

          {sheetUrl && sheetBlob && (
            <Card>
              <CardContent className="p-4">
                <SheetPreview
                  url={sheetUrl}
                  blob={sheetBlob}
                  filename={videoFile.name}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
