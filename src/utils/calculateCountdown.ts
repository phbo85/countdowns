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
