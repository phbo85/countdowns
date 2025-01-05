import { z } from "zod";

export const TMDBResultSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  name: z.string().optional(),
  posterPath: z.string().nullable(),
  releaseDate: z.string().optional(),
  firstAirDate: z.string().optional(),
  mediaType: z.enum(["movie", "tv", "person"]),
});

export type TMDBResult = z.infer<typeof TMDBResultSchema>;

export const MediaDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  posterPath: z.string().nullable(),
  releaseDate: z.string(),
  nextEpisodeDate: z.string().nullable().optional(),
  mediaType: z.enum(["movie", "tv"]),
});

export type MediaDetails = z.infer<typeof MediaDetailsSchema>;

export const TVShowResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  posterPath: z.string().nullable(),
  firstAirDate: z.string(),
  numberOfSeasons: z.number(),
});

export type TVShowResponse = z.infer<typeof TVShowResponseSchema>;

export const SeasonResponseSchema = z.object({
  episodes: z.array(
    z.object({
      airDate: z.string(),
      episodeNumber: z.number(),
      name: z.string(),
    })
  ),
});

export type SeasonResponse = z.infer<typeof SeasonResponseSchema>;

export const MovieResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  posterPath: z.string().nullable(),
  releaseDate: z.string(),
});

export type MovieResponse = z.infer<typeof MovieResponseSchema>;
