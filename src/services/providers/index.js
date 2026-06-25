import { env } from '../../config/env.js';
import { openaiProvider } from './openaiProvider.js';
import { geminiProvider } from './geminiProvider.js';
import { claudeProvider } from './claudeProvider.js';
import { groqProvider } from './groqProvider.js';
import { ollamaProvider } from './ollamaProvider.js';
import createError from 'http-errors';

const providers = {
  openai: openaiProvider,
  gemini: geminiProvider,
  claude: claudeProvider,
  groq: groqProvider,
  ollama: ollamaProvider
};

/**
 * Returns the currently configured active LLM provider.
 */
export function getActiveProvider() {
  const providerName = (env.llmProvider || 'openai').toLowerCase();
  const provider = providers[providerName];

  if (!provider) {
    throw createError(500, `Unsupported LLM_PROVIDER configured: ${providerName}`);
  }

  return provider;
}
