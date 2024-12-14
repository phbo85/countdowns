export interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv" | "person";
}

export interface MediaDetails {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  next_episode_date?: string | null;
  media_type: "movie" | "tv";
}

// Add these new interfaces for API responses
export interface TVShowResponse {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  number_of_seasons: number;
}

export interface SeasonResponse {
  episodes: Array<{
    air_date: string;
    episode_number: number;
    name: string;
  }>;
}

export interface MovieResponse {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}
