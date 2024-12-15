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

  const calculateCountdown = (): Countdown => {
    let targetDate;

    if (media.media_type === "tv" && media.next_episode_date) {
      targetDate = parseISO(media.next_episode_date);
    } else {
      targetDate = parseISO(media.release_date);
    }

    if (!isValid(targetDate)) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    const now = new Date();
    const days = differenceInDays(targetDate, now);
    const hours = differenceInHours(targetDate, now) % 24;
    const minutes = differenceInMinutes(targetDate, now) % 60;

    if (minutes < 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    return { days, hours, minutes };
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
        className="relative overflow-hidden w-[45%] lg:w-[30%] max-w-64 aspect-[2/3] cursor-pointer border-2"
        onClick={() => setIsDrawerOpen(true)}
      >
        <div>
          {media.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
              alt={media.title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-screen brightness-90"
            />
          )}
        </div>

        <div className="relative p-4 h-full flex flex-col justify-between">
          <h2 className="lg:text-2xl font-bold  text-center">{media.title}</h2>

          <div className="flex flex-col items-center justify-center">
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
      </Card>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="lg:text-4xl">{media.title}</DrawerTitle>
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
              <div className="border-2">
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                  alt={media.title}
                  className="w-full h-auto mb-4 mix-blend-screen"
                />
              </div>
            )}
          </div>
          <div className="text-center text-sm my-4">
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
          <Button variant="outline" onClick={onRemove} className="mx-4 mb-4">
            Remove
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
}
