import { GoogleGenAI } from '@google/genai';
import { cleanAndParseJSON } from './gemini';

interface GeminiCallParams {
  prompt: string;
  systemInstruction?: string;
  apiKey?: string;
}

/**
 * Server-side Gemini caller using the official @google/genai SDK
 * Executes with model fallback and strict JSON parsing
 */
export async function callGeminiApi({ prompt, systemInstruction, apiKey }: GeminiCallParams): Promise<any> {
  // Read ONLY from server-side environment variables or explicit server parameter
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key || key.trim() === '' || key === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const ai = new GoogleGenAI({ apiKey: key });
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error(`Empty response from Gemini model ${model}`);
      }

      return cleanAndParseJSON(text);
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini SDK invocation with model ${model} failed:`, err.message);
    }
  }

  throw lastError || new Error('All Gemini SDK model invocations failed');
}
