import axios from 'axios';
import { GEMINI_API_KEY, GEMINI_BASE_URL, GEMINI_MODEL } from '../../config/env';
import { generateSystemPrompt } from '../../shared/utils/system';

const geminiBaseUrl = GEMINI_BASE_URL.replace(/\/+$/, '');

type GeminiPart = {
  text?: string;
};

type GeminiContent = {
  role?: 'user' | 'model';
  parts: GeminiPart[];
};

const DESCRIPTION_SYSTEM_CONTEXT =
  'Generate a concise and engaging description for a project based on its name. The description should be 1-3 sentences long and highlight the main focus or goal of the project. Avoid using generic phrases and try to capture the unique aspects of the project based on its name and response in plain text.';

export const generateProjectDescriptionPrompt = (projectName: string): string => {
  return `Project Name: ${projectName}`;
};

const getTextFromContent = (content: GeminiContent): string =>
  content.parts
    .map((part) => part.text)
    .filter((text): text is string => typeof text === 'string')
    .join('')
    .trim();

const stripWrappingQuotes = (value: string): string =>
  value.replace(/^["']+|["']+$/g, '').trim();

const createGeminiContent = async (
  contents: GeminiContent[],
  options?: { temperature?: number; systemInstruction?: string },
): Promise<GeminiContent> => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required');
  }

  let response;
  try {
    response = await axios.post(
      `${geminiBaseUrl}/models/${GEMINI_MODEL}:generateContent`,
      {
        systemInstruction: options?.systemInstruction
          ? { parts: [{ text: options.systemInstruction }] }
          : undefined,
        contents,
        generationConfig: { temperature: options?.temperature ?? 0.4 },
      },
      {
        headers: {
          'X-goog-api-key': GEMINI_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(
        '[GEMINI ERROR]',
        JSON.stringify(err.response?.data ?? { message: err.message }),
      );
    }
    throw err;
  }

  const content = response.data?.candidates?.[0]?.content;
  if (!content) {
    throw new Error('Gemini response missing content');
  }

  return content as GeminiContent;
};

export const generateProjectDescription = async (projectName: string): Promise<string> => {
  const prompt = generateProjectDescriptionPrompt(projectName);
  const systemPrompt = generateSystemPrompt(DESCRIPTION_SYSTEM_CONTEXT);

  const content = await createGeminiContent(
    [{ role: 'user', parts: [{ text: prompt }] }],
    { systemInstruction: systemPrompt, temperature: 0.4 },
  );

  const text = stripWrappingQuotes(getTextFromContent(content));
  if (!text) {
    throw new Error('AI response was empty');
  }

  return text;
};