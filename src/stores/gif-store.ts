import { create } from "zustand";
import type { GifSettings } from "@/lib/types";
import { DEFAULT_GIF_SETTINGS } from "@/lib/constants";

interface GifState {
  settings: GifSettings;
  generating: boolean;
  progress: number;
  resultUrl: string | null;
  resultBlob: Blob | null;
  setSettings: (settings: Partial<GifSettings>) => void;
  setGenerating: (v: boolean) => void;
  setProgress: (v: number) => void;
  setResult: (url: string | null, blob: Blob | null) => void;
  reset: () => void;
}

export const useGifStore = create<GifState>((set, get) => ({
  settings: { ...DEFAULT_GIF_SETTINGS },
  generating: false,
  progress: 0,
  resultUrl: null,
  resultBlob: null,
  setSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),
  setGenerating: (generating) => set({ generating }),
  setProgress: (progress) => set({ progress }),
  setResult: (resultUrl, resultBlob) => {
    const prev = get().resultUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({ resultUrl, resultBlob });
  },
  reset: () => {
    const prev = get().resultUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      settings: { ...DEFAULT_GIF_SETTINGS },
      generating: false,
      progress: 0,
      resultUrl: null,
      resultBlob: null,
    });
  },
}));
