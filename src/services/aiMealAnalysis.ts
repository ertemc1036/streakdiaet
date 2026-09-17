import type { MealAnalysis } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-5';

export function isAiConfigured(): boolean {
  return Boolean(API_KEY);
}

/**
 * Sends a meal photo to Claude for a rough nutrition estimate.
 * Returns null when no API key is configured or the request fails,
 * so callers can fall back to manual entry.
 */
export async function analyzeMealPhoto(
  base64Image: string,
  mimeType: string
): Promise<MealAnalysis | null> {
  if (!API_KEY) return null;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mimeType, data: base64Image },
              },
              {
                type: 'text',
                text:
                  'Schätze die Nährwerte dieser Mahlzeit. Antworte NUR mit kompaktem JSON ' +
                  'im Format {"name": string, "calories": number, "protein": number, ' +
                  '"carbs": number, "fat": number}. Werte in Gramm bzw. kcal, gerundet.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text: string | undefined = data?.content?.[0]?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      name: String(parsed.name ?? 'Mahlzeit'),
      calories: Number(parsed.calories) || 0,
      protein: Number(parsed.protein) || 0,
      carbs: Number(parsed.carbs) || 0,
      fat: Number(parsed.fat) || 0,
    };
  } catch {
    return null;
  }
}
