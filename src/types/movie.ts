export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

export type suggestMovieParams = {
  prompt: string;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setMovies: (movies: Movie[]) => void;
};

export type MovieSuggestion = { title: string };