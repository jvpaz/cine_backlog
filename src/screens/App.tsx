import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "@/styles/global";
import { Movie } from "@/types/movie";
import { useMovieSuggestion } from "@/hooks/useMovieSuggestion";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w342";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getMovieSuggestions } = useMovieSuggestion({
    prompt,
    setError,
    setLoading,
    setMovies,
  });
  

  return (
    <View style={styles.main}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>Cine Backlog</Text>
        <Text style={styles.subtitle}>
          Descreva o que está procurando e encontre seu próximo filme favorito.
        </Text>

        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Ex: Filme de ação com comédia, protagonista carismático."
          placeholderTextColor="#77777f"
          multiline
          maxLength={300}
          style={styles.input}
          returnKeyType="go"
          onSubmitEditing={getMovieSuggestions}
        />
        <Pressable
          onPress={getMovieSuggestions}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#141414" />
          ) : (
            <Text style={styles.buttonText}>
              Encontrar filmes <Text style={styles.arrow}>↗</Text>
            </Text>
          )}
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {movies.length > 0 && (
          <Text style={styles.resultsTitle}>SELECIONADOS PARA VOCÊ</Text>
        )}
        <View style={styles.grid}>
          {movies.map((movie) => (
            <View key={movie.id} style={styles.card}>
              {movie.poster_path ? (
                <Image
                  source={{ uri: `${POSTER_BASE_URL}${movie.poster_path}` }}
                  style={styles.poster}
                />
              ) : (
                <View style={[styles.poster, styles.noPoster]}>
                  <Text style={styles.noPosterText}>Sem capa</Text>
                </View>
              )}
              <Text style={styles.movieTitle} numberOfLines={2}>
                {movie.title}
              </Text>
              {movie.release_date ? (
                <Text style={styles.year}>
                  {movie.release_date.slice(0, 4)}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
