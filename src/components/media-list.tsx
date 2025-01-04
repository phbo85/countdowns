"use client";

import MediaTile from "@/components/media-tile";
import { useMediaStore } from "@/stores/media-store";
import { Card, CardHeader, CardTitle } from "./ui/card";

export default function MediaList() {
  const { selectedMedia, removeMedia } = useMediaStore();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      {selectedMedia.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Nothing tracked yet, search for a movie or tv show to add
            </CardTitle>
          </CardHeader>
        </Card>
      )}
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
