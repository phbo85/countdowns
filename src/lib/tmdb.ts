import axios from "axios";
import {
  TMDBResultSchema,
  TVShowResponseSchema,
  SeasonResponseSchema,
  MovieResponseSchema,
  TMDBResult,
  MediaDetails,
} from "@/types/tmdb";
import { parseISO, isAfter } from "date-fns";
import { camelCaseKeys } from "@/utils/camelCaseKeys";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const searchMedia = async (query: string): Promise<TMDBResult[]> => {
  try {
    const response = await axios.get<{ results: unknown }>(
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

    if (!response.data.results) {
      return [];
    }

    const filteredResults = (response.data.results as unknown[])?.filter(
      (result) => {
        const media = result as { media_type?: string };
        return media.media_type === "movie" || media.media_type === "tv";
      }
    );
    const results = TMDBResultSchema.array().parse(
      camelCaseKeys(filteredResults as object)
    );

    return results.filter((item) => {
      if (item.mediaType === "movie" && item.releaseDate) {
        return isAfter(parseISO(item.releaseDate), today);
      } else if (item.mediaType === "tv" && item.firstAirDate) {
        return parseISO(item.firstAirDate);
      }
      return false;
    });
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
};

export const getMediaDetails = async (
  id: number,
  mediaType: "movie" | "tv"
): Promise<MediaDetails | null> => {
  try {
    if (mediaType === "tv") {
      const showResponse = await axios.get<unknown>(`${BASE_URL}/tv/${id}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      });

      const show = TVShowResponseSchema.parse(
        camelCaseKeys(showResponse.data as object)
      );
      let nextEpisodeDate: string | null = null;

      const latestSeasonNumber = show.numberOfSeasons;

      try {
        const seasonResponse = await axios.get<unknown>(
          `${BASE_URL}/tv/${id}/season/${latestSeasonNumber}`,
          {
            params: {
              api_key: TMDB_API_KEY,
            },
          }
        );

        const season = SeasonResponseSchema.parse(
          camelCaseKeys(seasonResponse.data as object)
        );

        const today = new Date();
        const futureEpisodes = season.episodes
          .filter(
            (episode) =>
              episode.airDate && isAfter(parseISO(episode.airDate), today)
          )
          .sort(
            (a, b) =>
              parseISO(a.airDate).getTime() - parseISO(b.airDate).getTime()
          );

        if (futureEpisodes.length > 0) {
          nextEpisodeDate = futureEpisodes[0].airDate;
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
        posterPath: show.posterPath
          ? `https://image.tmdb.org/t/p/w500${show.posterPath}`
          : "",
        releaseDate: show.firstAirDate,
        nextEpisodeDate,
        mediaType: "tv",
      };
    }

    const response = await axios.get<unknown>(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

    const data = MovieResponseSchema.parse(
      camelCaseKeys(response.data as object)
    );
    return {
      id: data.id,
      title: data.title,
      posterPath: data.posterPath
        ? `https://image.tmdb.org/t/p/w500${data.posterPath}`
        : "",
      releaseDate: data.releaseDate,
      mediaType: "movie",
    };
  } catch (error) {
    console.error("Error fetching media details:", error);
    return null;
  }
};
