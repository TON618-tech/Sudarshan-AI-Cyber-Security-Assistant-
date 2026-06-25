import OpenAI from 'openai';
import { env } from './env.js';

export const openaiClient = new OpenAI({
  apiKey: env.openaiApiKey
});
