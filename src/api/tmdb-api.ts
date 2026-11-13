import { getMovieSuggestions } from "@/ai/engine";

const TMDB_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

export async function getMovieSuggestionsFromTMDB(request: string) {

      const suggestions = await getMovieSuggestions(request);

      if (!TMDB_KEY) {
        throw new Error("Configure a chave do TMDB no arquivo .env.");
      }

      const results = await Promise.all(
        suggestions.slice(0, 4).map(async ({ title }) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&language=pt-BR`,
          );
          if (!response.ok)
            throw new Error(
              "Não foi possível buscar os filmes no TMDB. Confira a chave.",
            );
          const data = await response.json();
          return data.results?.[0];
        }),
      );
      const found = results.filter((movie) => movie !== null);
      if (!found.length)
        throw new Error(
          "Não encontramos esses filmes no TMDB. Tente outro pedido.",
        );
        return found;
    }

