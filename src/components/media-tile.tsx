import { Card, CardContent } from "@/components/ui/card";
import { MediaDetails } from "@/types/tmdb";
import { calculateCountdown } from "@/utils/calculateCountdown";
import { useEffect, useState } from "react";
import MediaDrawer from "./media-drawer";

interface MediaTileProps {
  media: MediaDetails;
  onRemove: () => void;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
}

export default function MediaTile({ media, onRemove }: MediaTileProps) {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(media));
    }, 60_000); // Update every minute

    // Set initial countdown
    setCountdown(calculateCountdown(media));

    return () => clearInterval(interval);
  }, [media]);

  return (
    <>
      <Card
        className="relative w-full aspect-[2/3] cursor-pointer"
        onClick={() => setIsDrawerOpen(true)}
      >
        <CardContent
          className="h-full flex justify-center items-center bg-cover"
          style={{
            backgroundImage: media.poster_path
              ? `url(https://image.tmdb.org/t/p/w500${media.poster_path})`
              : undefined,
          }}
        >
          <div className="relative p-4 h-full flex flex-col justify-between">
            <div className="flex flex-col items-center justify-center m-auto backdrop-filter backdrop-blur-sm text-white bg-black/30 rounded-xl p-2">
              {countdown.days > 0 && (
                <span className="text-xl lg:text-5xl font-bold ">
                  {countdown.days}d
                </span>
              )}
              {countdown.hours > 0 && (
                <span className="text-xl lg:text-5xl font-bold ">
                  {countdown.hours}h
                </span>
              )}
              {countdown.minutes > 0 ? (
                <span className="text-xl lg:text-5xl font-bold ">
                  {countdown.minutes}m
                </span>
              ) : (
                <span className="text-xl lg:text-3xl font-bold ">released</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <MediaDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        media={media}
        onRemove={onRemove}
      />
    </>
  );
}
