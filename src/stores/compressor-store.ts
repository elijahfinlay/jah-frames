import { create } from "zustand";
import type { CompressionSettings, CompressionResult } from "@/lib/types";
import { DEFAULT_COMPRESSION_SETTINGS } from "@/lib/constants";

interface CompressorState {
  settings: CompressionSettings;
  result: CompressionResult | null;
  compressing: boolean;
  progress: number;
  setSettings: (settings: Partial<CompressionSettings>) => void;
  setResult: (result: CompressionResult | null) => void;
  setCompressing: (v: boolean) => void;
  setProgress: (v: number) => void;
  reset: () => void;
}

export const useCompressorStore = create<CompressorState>((set, get) => ({
  settings: { ...DEFAULT_COMPRESSION_SETTINGS },
  result: null,
  compressing: false,
  progress: 0,
  setSettings: (partial) =>
    set((s) => ({ settings: { ...s.settings, ...partial } })),
  setResult: (result) => {
    const prev = get().result;
    if (prev?.url) URL.revokeObjectURL(prev.url);
    set({ result });
  },
  setCompressing: (compressing) => set({ compressing }),
  setProgress: (progress) => set({ progress }),
  reset: () => {
    const prev = get().result;
    if (prev?.url) URL.revokeObjectURL(prev.url);
    set({
      settings: { ...DEFAULT_COMPRESSION_SETTINGS },
      result: null,
      compressing: false,
      progress: 0,
    });
  },
}));
