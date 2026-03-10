import { create } from "zustand";
import type { ExtractionSettings, ExtractionMode, ImageFormat } from "@/lib/types";
import { DEFAULT_EXTRACTION_SETTINGS } from "@/lib/constants";

interface ExtractionState {
  settings: ExtractionSettings;
  setMode: (mode: ExtractionMode) => void;
  setFps: (fps: number) => void;
  setCount: (count: number) => void;
  setStartTime: (time: number) => void;
  setEndTime: (time: number) => void;
  setFormat: (format: ImageFormat) => void;
  setQuality: (quality: number) => void;
  reset: () => void;
}

export const useExtractionStore = create<ExtractionState>((set) => ({
  settings: { ...DEFAULT_EXTRACTION_SETTINGS },
  setMode: (mode) => set((s) => ({ settings: { ...s.settings, mode } })),
  setFps: (fps) => set((s) => ({ settings: { ...s.settings, fps } })),
  setCount: (count) => set((s) => ({ settings: { ...s.settings, count } })),
  setStartTime: (startTime) => set((s) => ({ settings: { ...s.settings, startTime } })),
  setEndTime: (endTime) => set((s) => ({ settings: { ...s.settings, endTime } })),
  setFormat: (format) => set((s) => ({ settings: { ...s.settings, format } })),
  setQuality: (quality) => set((s) => ({ settings: { ...s.settings, quality } })),
  reset: () => set({ settings: { ...DEFAULT_EXTRACTION_SETTINGS } }),
}));
