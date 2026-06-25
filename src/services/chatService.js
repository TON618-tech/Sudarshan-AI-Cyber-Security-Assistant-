import { getActiveProvider } from './providers/index.js';
import { CYBER_RABBIT_SYSTEM_PROMPT } from '../utils/systemPrompt.js';

function logProviderUsage(action, result, startTime) {
  const duration = (performance.now() - startTime).toFixed(0);
  console.log(`[LLM Service] Action: ${action} | Provider: ${result.provider} | Model: ${result.model} | Time: ${duration}ms | Tokens: In=${result.usage?.prompt_tokens || 0}, Out=${result.usage?.completion_tokens || 0}`);
}

/**
 * ✅ OPTIMIZED: Adaptive response generation based on incident severity
 * Adjusts system prompt instruction and max tokens to match the complexity of the issue
 */
export async function getChatResponse(userMessage, severity = 'MEDIUM', rollingSummary = '', recentMessages = []) {
  const provider = getActiveProvider();
  const startTime = performance.now();

  // ✅ OPTIMIZATION: Adapt system prompt and response length based on severity
  let systemPrompt = CYBER_RABBIT_SYSTEM_PROMPT;
  let maxTokens = 2048;  // Default: comprehensive response
  
  if (severity === 'LOW') {
    // Low severity (password reset, locked account): brief, actionable response
    systemPrompt += `\n\n[SEVERITY HINT: LOW]\nThis is a simple authentication issue. Keep your response brief and actionable (2-3 paragraphs max). Focus on immediate steps only.`;
    maxTokens = 500;  // ✅ 75% token reduction
  } else if (severity === 'CRITICAL') {
    // Critical severity (fraud, breach, extortion): comprehensive guidance
    systemPrompt += `\n\n[SEVERITY HINT: CRITICAL]\nThis is a critical security incident. Provide comprehensive guidance covering immediate actions, evidence preservation, legal references, and reporting procedures.`;
    maxTokens = 2048;  // Full response
  } else {
    // Medium severity: balanced response
    maxTokens = 1024;
  }

  const result = await provider.generateResponse(
    systemPrompt,
    rollingSummary,
    recentMessages,
    userMessage,
    { maxTokens }  // ✅ Pass severity-based token limit to provider
  );

  logProviderUsage('getChatResponse', result, startTime);
  return result.reply;
}

export async function generateRollingSummary(currentSummary, recentMessages) {
  const provider = getActiveProvider();
  const startTime = performance.now();

  const result = await provider.generateSummary(
    'You are a memory module for a cybersecurity assistant.\nYour task is to merge the "Current Summary" and the "Recent Conversation" into a single, cohesive, updated "Rolling Summary".\nThe summary must track the user\'s cybersecurity incident, timeline, actions taken, and current status.\nKeep it concise. Do not use conversational filler. Maintain any [REDACTED] placeholders.',
    currentSummary,
    recentMessages
  );

  logProviderUsage('generateRollingSummary', result, startTime);
  return result.reply;
}
