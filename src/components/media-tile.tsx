import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaDetails } from "@/types/tmdb";
import {
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { useEffect, useState } from "react";

interface MediaTileProps {
  media: MediaDetails;
  onRemove: () => void;
}

export default function MediaTile({ media, onRemove }: MediaTileProps) {
  const [countdown, setCountdown] = useState<string>("");

  const calculateCountdown = () => {
    let targetDate;

    if (media.media_type === "tv" && media.next_episode_date) {
      targetDate = parseISO(media.next_episode_date);
    } else {
      targetDate = parseISO(media.release_date);
    }

    const now = new Date();
    const days = differenceInDays(targetDate, now);
    const hours = differenceInHours(targetDate, now) % 24;
    const minutes = differenceInMinutes(targetDate, now) % 60;

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
    <div className="relative border rounded-lg p-4 shadow-md">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      {media.poster_path && (
        <img
          src={media.poster_path}
          alt={media.title}
          className="w-full h-64 object-cover rounded-t-lg mb-4"
        />
      )}

      <h2 className="text-lg font-bold mb-2">{media.title}</h2>

      <div className="flex items-center">
        <Clock className="mr-2 h-4 w-4" />
        <span>{countdown}</span>
      </div>

      <div className="text-sm text-gray-500 mt-2">
        {media.media_type === "tv"
          ? media.next_episode_date
            ? `Next Episode: ${new Date(
                media.next_episode_date
              ).toLocaleDateString()}`
            : "TV Show"
          : `Release Date: ${new Date(
              media.release_date
            ).toLocaleDateString()}`}
      </div>
    </div>
  );
}
