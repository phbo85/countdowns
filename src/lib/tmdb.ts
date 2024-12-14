import axios from "axios";
import {
  TMDBResult,
  MediaDetails,
  TVShowResponse,
  SeasonResponse,
  MovieResponse,
} from "@/types/tmdb";
import { parseISO, isAfter } from "date-fns";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMedia(query: string): Promise<TMDBResult[]> {
  try {
    const response = await axios.get<{ results: TMDBResult[] }>(
      `${BASE_URL}/search/multi`,
      {
        params: {
          api_key: TMDB_API_KEY,
          query,
          include_adult: false,
        },
      }
    );

    const today = new Date();

    return response.data.results.filter((item: TMDBResult) => {
      if (item.media_type === "movie" && item.release_date) {
        return isAfter(parseISO(item.release_date), today);
      } else if (item.media_type === "tv" && item.first_air_date) {
        return parseISO(item.first_air_date);
      }
      return false;
    });
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
}

export async function getMediaDetails(
  id: number,
  mediaType: "movie" | "tv"
): Promise<MediaDetails | null> {
  try {
    if (mediaType === "tv") {
      const showResponse = await axios.get<TVShowResponse>(
        `${BASE_URL}/tv/${id}`,
        {
          params: {
            api_key: TMDB_API_KEY,
          },
        }
      );

      const show = showResponse.data;
      let nextEpisodeDate: string | null = null;

      // Get the latest season number
      const latestSeasonNumber = show.number_of_seasons;

      // Fetch episodes for the latest season
      try {
        const seasonResponse = await axios.get<SeasonResponse>(
          `${BASE_URL}/tv/${id}/season/${latestSeasonNumber}`,
          {
            params: {
              api_key: TMDB_API_KEY,
            },
          }
        );

        // Find the next episode after today
        const today = new Date();
        const futureEpisodes = seasonResponse.data.episodes
          .filter(
            (episode) =>
              episode.air_date && isAfter(parseISO(episode.air_date), today)
          )
          .sort(
            (a, b) =>
              parseISO(a.air_date).getTime() - parseISO(b.air_date).getTime()
          );

        // Take the first future episode's date
        if (futureEpisodes.length > 0) {
          nextEpisodeDate = futureEpisodes[0].air_date;
        }
      } catch (seasonError) {
        console.log(
          `Error fetching season details for TV show ${id}:`,
          seasonError
        );
      }

      return {
        id: show.id,
        title: show.name,
        poster_path: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : "",
        release_date: show.first_air_date,
        next_episode_date: nextEpisodeDate,
        media_type: "tv",
      };
    } else {
      // For movies, keep the existing logic
      const response = await axios.get<MovieResponse>(
        `${BASE_URL}/movie/${id}`,
        {
          params: {
            api_key: TMDB_API_KEY,
          },
        }
      );

      const data = response.data;
      return {
        id: data.id,
        title: data.title,
        poster_path: data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : "",
        release_date: data.release_date,
        media_type: "movie",
      };
    }
  } catch (error) {
    console.error("Error fetching media details:", error);
    return null;
  }
}
