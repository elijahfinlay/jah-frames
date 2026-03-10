import { create } from "zustand";
import type { BatchItem } from "@/lib/types";

interface BatchState {
  items: BatchItem[];
  addItem: (file: File) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, update: Partial<BatchItem>) => void;
  clearAll: () => void;
  getNextQueued: () => BatchItem | undefined;
}

export const useBatchStore = create<BatchState>((set, get) => ({
  items: [],
  addItem: (file) =>
    set((s) => ({
      items: [
        ...s.items,
        {
          id: `batch_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          file,
          status: "queued",
          progress: 0,
          frames: [],
        },
      ],
    })),
  removeItem: (id) =>
    set((s) => {
      const item = s.items.find((i) => i.id === id);
      item?.frames.forEach((f) => URL.revokeObjectURL(f.url));
      return { items: s.items.filter((i) => i.id !== id) };
    }),
  updateItem: (id, update) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, ...update } : i)),
    })),
  clearAll: () => {
    get().items.forEach((item) => {
      item.frames.forEach((f) => URL.revokeObjectURL(f.url));
    });
    set({ items: [] });
  },
  getNextQueued: () => get().items.find((i) => i.status === "queued"),
}));
