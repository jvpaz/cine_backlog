import { getMovieSuggestionsFromTMDB } from "@/api/tmdb-api";
import { suggestMovieParams } from "@/types/movie";



export function useMovieSuggestion({
  prompt,
  setError,
  setLoading,
  setMovies,
}: suggestMovieParams) {
  const getMovieSuggestions = async () => {
    const request = prompt.trim();
    if (!request) {
      setError("Conte um pouco sobre o filme que você quer assistir.");
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);
    try {
      const found = await getMovieSuggestionsFromTMDB(request);
      setMovies(found);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Algo deu errado. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { getMovieSuggestions };
}
