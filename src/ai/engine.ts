import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { MovieSuggestion } from '../types/movie';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const model = 'gemini-3.5-flash-lite';



export async function getMovieSuggestions(prompt: string): Promise<MovieSuggestion[]> {
  if (!apiKey) {
    throw new Error('Configure a chave do Gemini no arquivo .env.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const stream = await ai.models.generateContentStream({
    model,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      responseMimeType: 'application/json',
    },
    contents: `Sugira exatamente 4 filmes que combinem com este pedido: "${prompt}". Responda somente com um array JSON de objetos no formato {"title":"título original do filme"}. Sem introdução nem markdown.`,
  });

  let text = '';
  for await (const chunk of stream) {
    text += chunk.text ?? '';
  }

  const suggestions: unknown = JSON.parse(text);
  if (
    !Array.isArray(suggestions) ||
    suggestions.length === 0 ||
    !suggestions.every(
      (suggestion): suggestion is MovieSuggestion =>
        typeof suggestion === 'object' &&
        suggestion !== null &&
        'title' in suggestion &&
        typeof suggestion.title === 'string',
    )
  ) {
    throw new Error('A IA não retornou sugestões válidas. Tente novamente.');
  }

  return suggestions.slice(0, 4);
}
