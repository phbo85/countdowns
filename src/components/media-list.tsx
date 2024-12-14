"use client";

import MediaTile from "@/components/media-tile";
import { useMediaStore } from "@/stores/media-store";

export default function MediaList() {
  const { selectedMedia, removeMedia } = useMediaStore();

  return (
    <div className="flex flex-wrap gap-4">
      {selectedMedia.map((media) => (
        <MediaTile
          key={media.id}
          media={media}
          onRemove={() => removeMedia(media.id)}
        />
      ))}
    </div>
  );
}
