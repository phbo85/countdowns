import {
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isValid,
} from "date-fns";
import { MediaDetails } from "@/types/tmdb";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
}

export const calculateCountdown = (media: MediaDetails): Countdown => {
  if (!media.releaseDate && !media.nextEpisodeDate) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const targetDate =
    media.mediaType === "tv" && media.nextEpisodeDate
      ? parseISO(media.nextEpisodeDate)
      : parseISO(media.releaseDate);

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
