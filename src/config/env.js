import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  llmProvider: process.env.LLM_PROVIDER || 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-pro',
  claudeApiKey: process.env.CLAUDE_API_KEY || '',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-3-sonnet',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 50),
  emailjsServiceId: process.env.EMAILJS_SERVICE_ID || '',
  emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID || '',
  emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || '',
  apiSecretKey: process.env.API_SECRET_KEY || '',
  dailyBudgetUSD: Number(process.env.DAILY_BUDGET_USD || 45)
};

export const isProduction = env.nodeEnv === 'production';

// Fail-fast: validate active provider has an API key configured
const activeProvider = env.llmProvider.toLowerCase();
const providerKeyMap = {
  openai: env.openaiApiKey,
  gemini: env.geminiApiKey,
  claude: env.claudeApiKey,
  groq: env.groqApiKey,
  ollama: 'not-required'
};
if (isProduction && activeProvider !== 'ollama' && !providerKeyMap[activeProvider]) {
  throw new Error(`FATAL: Active LLM provider "${activeProvider}" has no API key configured. Set the corresponding environment variable.`);
}
