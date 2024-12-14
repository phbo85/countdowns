export interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
}

export interface MediaDetails {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  next_episode_date?: string | null;
  media_type: "movie" | "tv";
}
