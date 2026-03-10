import { create } from "zustand";
import type { VideoFile } from "@/lib/types";

interface VideoState {
  video: VideoFile | null;
  setVideo: (video: VideoFile | null) => void;
  clear: () => void;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  video: null,
  setVideo: (video) => set({ video }),
  clear: () => {
    const current = get().video;
    if (current) {
      URL.revokeObjectURL(current.url);
    }
    set({ video: null });
  },
}));
