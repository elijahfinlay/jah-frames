import { create } from "zustand";
import type { FilterSettings } from "@/lib/types";
import { DEFAULT_FILTER_SETTINGS } from "@/lib/constants";

interface FilterState {
  filters: FilterSettings;
  setBrightness: (v: number) => void;
  setContrast: (v: number) => void;
  setSaturation: (v: number) => void;
  setBlur: (v: number) => void;
  reset: () => void;
  hasChanges: () => boolean;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: { ...DEFAULT_FILTER_SETTINGS },
  setBrightness: (v) => set((s) => ({ filters: { ...s.filters, brightness: v } })),
  setContrast: (v) => set((s) => ({ filters: { ...s.filters, contrast: v } })),
  setSaturation: (v) => set((s) => ({ filters: { ...s.filters, saturation: v } })),
  setBlur: (v) => set((s) => ({ filters: { ...s.filters, blur: v } })),
  reset: () => set({ filters: { ...DEFAULT_FILTER_SETTINGS } }),
  hasChanges: () => {
    const f = get().filters;
    return (
      f.brightness !== 100 || f.contrast !== 100 || f.saturation !== 100 || f.blur !== 0
    );
  },
}));
