import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaDetails } from "@/types/tmdb";
import {
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isValid,
} from "date-fns";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

interface MediaTileProps {
  media: MediaDetails;
  onRemove: () => void;
}

export default function MediaTile({ media, onRemove }: MediaTileProps) {
  const [countdown, setCountdown] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const calculateCountdown = () => {
    let targetDate;

    if (media.media_type === "tv" && media.next_episode_date) {
      targetDate = parseISO(media.next_episode_date);
    } else {
      targetDate = parseISO(media.release_date);
    }

    if (!isValid(targetDate)) {
      return "Unknown date";
    }

    const now = new Date();
    const days = differenceInDays(targetDate, now);

    const hours = differenceInHours(targetDate, now) % 24;
    const minutes = differenceInMinutes(targetDate, now) % 60;

    if (minutes < 0) {
      return "Released";
    }

    return `${days}d ${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 60000); // Update every minute

    // Set initial countdown
    setCountdown(calculateCountdown());

    return () => clearInterval(interval);
  }, [media]);

  return (
    <>
      <Card
        className="relative overflow-hidden w-[45%] lg:w-[30%] max-w-64 aspect-[2/3] cursor-pointer"
        onClick={() => setIsDrawerOpen(true)}
      >
        {media.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
            alt={media.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="relative z-10 p-4 bg-black bg-opacity-50 h-full flex flex-col justify-between">
          <h2 className="lg:text-2xl font-bold text-white">{media.title}</h2>

          <div className="flex items-center justify-center">
            <span className="text-xl lg:text-4xl font-bold text-white">
              {countdown}
            </span>
          </div>
        </div>
      </Card>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{media.title}</DrawerTitle>
            <DrawerClose />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerHeader>
          <div className="p-4 aspect-[2/3] w-72 max-w-[80vw] mx-auto">
            {media.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={media.title}
                className="w-full h-auto mb-4"
              />
            )}
            <div className="text-center text-sm text-gray-300 mb-4">
              {media.media_type === "tv"
                ? media.next_episode_date
                  ? `Next Episode: ${new Date(
                      media.next_episode_date
                    ).toLocaleDateString()}`
                  : "Next Episode: Unknown"
                : `Release Date: ${new Date(
                    media.release_date
                  ).toLocaleDateString()}`}
            </div>
            <Button variant="outline" onClick={onRemove} className="w-full">
              Remove
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
