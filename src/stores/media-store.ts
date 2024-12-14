"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MediaDetails } from "@/types/tmdb";

interface MediaStore {
  selectedMedia: MediaDetails[];
  setSelectedMedia: (media: MediaDetails[]) => void;
  removeMedia: (id: number) => void;
}

export const useMediaStore = create<MediaStore>(
  persist(
    (set) => ({
      selectedMedia: [],
      setSelectedMedia: (media) => set({ selectedMedia: media }),
      removeMedia: (id) =>
        set((state) => ({
          selectedMedia: state.selectedMedia.filter((media) => media.id !== id),
        })),
    }),
    {
      name: "tracked-media", // name of the item in the storage (must be unique)
    }
  )
);
