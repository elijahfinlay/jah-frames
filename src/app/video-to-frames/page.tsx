"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ImageIcon, Camera } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoDropzone } from "@/components/shared/video-dropzone";
import { VideoPreview } from "@/components/shared/video-preview";
import { FrameGallery } from "@/components/shared/frame-gallery";
import { DownloadButton } from "@/components/shared/download-button";
import { ProgressBar } from "@/components/shared/progress-bar";
import { WarningBanner } from "@/components/shared/warning-banner";
import { ExtractionControls } from "@/components/frames/extraction-controls";
import { ManualCapture } from "@/components/frames/manual-capture";
import { FrameFilterPanel } from "@/components/frames/frame-filter-panel";
import { FrameComparison } from "@/components/frames/frame-comparison";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { useVideoMetadata } from "@/hooks/use-video-metadata";
import { useFrameExtraction } from "@/hooks/use-frame-extraction";
import { useDownload } from "@/hooks/use-download";
import { useExtractionStore } from "@/stores/extraction-store";
import { useFilterStore } from "@/stores/filter-store";
import { MEMORY_WARNING_THRESHOLD } from "@/lib/constants";
import type { ExtractedFrame } from "@/lib/types";

export default function VideoToFramesPage() {
  const { loaded: ffmpegReady } = useFFmpeg();
  const { videoFile, loadVideo, clearVideo } = useVideoMetadata();
  const { frames, extracting, progress, frameCount, extract, clearFrames, removeFrame, setFrames } =
    useFrameExtraction();
  const { downloading, zipProgress, downloadSingle, downloadZip } = useDownload();
  const store = useExtractionStore();
  const filterStore = useFilterStore();
  const [selectedFrame, setSelectedFrame] = useState<ExtractedFrame | null>(null);
  const [activeTab, setActiveTab] = useState("auto");

  const handleFileSelect = useCallback(
    async (file: File) => {
      clearFrames();
      try {
        const vf = await loadVideo(file);
        store.setEndTime(vf.duration);
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
      toast.success("Frames extracted successfully!");
    } catch {
      toast.error("Extraction failed. Try a different file or settings.");
    }
  }, [videoFile, extract, store.settings]);

  const handleManualCapture = useCallback(
    (frame: ExtractedFrame) => {
      setFrames((prev) => [...prev, frame]);
    },
    [setFrames]
  );

  const handleClear = useCallback(() => {
    clearVideo();
    clearFrames();
    store.reset();
    filterStore.reset();
    setSelectedFrame(null);
  }, [clearVideo, clearFrames, store, filterStore]);

  const showMemoryWarning = videoFile && videoFile.size > MEMORY_WARNING_THRESHOLD;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Layers className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Video to Frames</h1>
        <p className="mt-2 text-muted-foreground">
          Extract frames from any video. 100% client-side — your video never leaves your device.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Controls Sidebar */}
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
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4 grid w-full grid-cols-2">
                      <TabsTrigger value="auto" className="gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5" />
                        Auto
                      </TabsTrigger>
                      <TabsTrigger value="manual" className="gap-1.5">
                        <Camera className="h-3.5 w-3.5" />
                        Manual
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="auto">
                      <ExtractionControls
                        settings={store.settings}
                        duration={videoFile.duration}
                        extracting={extracting}
                        ffmpegReady={ffmpegReady}
                        onModeChange={store.setMode}
                        onFpsChange={store.setFps}
                        onCountChange={store.setCount}
                        onStartTimeChange={store.setStartTime}
                        onEndTimeChange={store.setEndTime}
                        onFormatChange={store.setFormat}
                        onQualityChange={store.setQuality}
                        onExtract={handleExtract}
                      />
                    </TabsContent>

                    <TabsContent value="manual">
                      <ManualCapture
                        videoUrl={videoFile.url}
                        videoFile={videoFile.file}
                        format={store.settings.format}
                        quality={store.settings.quality}
                        onCapture={handleManualCapture}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardContent className="p-4">
                  <FrameFilterPanel />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {showMemoryWarning && (
            <WarningBanner message="Large file detected. Extraction may use significant memory. Consider using a time range to limit frames." />
          )}

          {videoFile && activeTab === "auto" && (
            <Card>
              <CardContent className="p-4">
                <VideoPreview src={videoFile.url} className="aspect-video" />
              </CardContent>
            </Card>
          )}

          <AnimatePresence>
            {extracting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <ProgressBar
                      progress={progress}
                      label={`Extracting frames... (${frameCount} found)`}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedFrame && (
            <Card>
              <CardContent className="p-4">
                <FrameComparison frameUrl={selectedFrame.url} />
              </CardContent>
            </Card>
          )}

          {frames.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {frames.length} frame{frames.length !== 1 ? "s" : ""} extracted
                </p>
                <DownloadButton
                  frameCount={frames.length}
                  onDownloadAll={() =>
                    downloadZip(frames, videoFile?.name || "video", store.settings.format)
                  }
                  downloading={downloading}
                  progress={zipProgress}
                />
              </div>

              <FrameGallery
                frames={frames}
                selectedId={selectedFrame?.id}
                onSelect={setSelectedFrame}
                onDownload={(frame, index) =>
                  downloadSingle(frame, videoFile?.name || "video", index)
                }
                onRemove={removeFrame}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
