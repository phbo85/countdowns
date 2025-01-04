import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaDetails } from "@/types/tmdb";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

interface MediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaDetails;
  onRemove: () => void;
}

export default function MediaDrawer({
  isOpen,
  onClose,
  media,
  onRemove,
}: MediaDrawerProps) {
  const targetDate =
    media.media_type === "tv" && media.next_episode_date
      ? new Date(media.next_episode_date)
      : new Date(media.release_date);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="max-w-sm mx-auto flex flex-col items-center">
          <DrawerClose />
          <DrawerTitle className="lg:text-4xl text-center">
            {media.title}
          </DrawerTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>
        <div className="max-w-sm mx-auto flex flex-col items-center">
          <div className="p-4 aspect-[2/3] w-72 max-w-[80vw] mx-auto">
            {media.poster_path && (
              <div
                className="h-full flex justify-center items-center bg-cover border-4 shadow"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w500${media.poster_path})`,
                }}
              />
            )}
          </div>
          <div className="text-center text-sm my-4">
            {media.media_type === "tv"
              ? media.next_episode_date
                ? `Next Episode: ${targetDate.toLocaleDateString()} ${targetDate.toLocaleTimeString()}`
                : "Next Episode: Unknown"
              : `Release Date: ${targetDate.toLocaleDateString()} ${targetDate.toLocaleTimeString()}`}
          </div>

          <Button variant="outline" onClick={onRemove} className="mx-4 mb-4">
            Remove
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
