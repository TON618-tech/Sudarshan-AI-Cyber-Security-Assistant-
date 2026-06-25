import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import { logSecurityEvent } from '../utils/logger.js';

const BUDGET_FILE = path.join(process.cwd(), '.budget-state.json');

function readBudgetState() {
  try {
    const raw = fs.readFileSync(BUDGET_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    // File doesn't exist or is corrupt — start fresh
    return { date: '', count: 0, cost: 0 };
  }
}

function writeBudgetState(state) {
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(state), 'utf8');
}

function getTodayUTC() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

// Estimated average cost per server API route request in USD (including prompt + completion + classification + summary calls)
const ESTIMATED_REQUEST_COSTS = {
  openai: 0.002,  // GPT-4o-mini is extremely cheap (~$0.0005, with classification/summary avg $0.002)
  gemini: 0.01,   // Gemini 2.5 Pro (avg $0.01 per server API call)
  claude: 0.02,   // Claude 3.5 Sonnet (avg $0.02 per server API call)
  groq: 0.001,    // Groq (Mixtral)
  ollama: 0.0     // Local/Free
};

export function budgetGuard(req, res, next) {
  const today = getTodayUTC();
  const state = readBudgetState();

  // Reset counter and cost if the day has changed
  if (state.date !== today) {
    state.date = today;
    state.count = 0;
    state.cost = 0;
  }

  const provider = (env.llmProvider || 'openai').toLowerCase();
  const requestCost = ESTIMATED_REQUEST_COSTS[provider] !== undefined 
    ? ESTIMATED_REQUEST_COSTS[provider] 
    : 0.01; // fallback to $0.01

  state.count += 1;
  state.cost = Number(((state.cost || 0) + requestCost).toFixed(4));

  if (state.cost > env.dailyBudgetUSD) {
    logSecurityEvent('BUDGET_EXHAUSTION', req, {
      count: state.count,
      cost: state.cost,
      budget: env.dailyBudgetUSD,
      date: today,
      provider
    });
    writeBudgetState(state);
    return res.status(503).json({
      success: false,
      error: 'Daily API budget exhausted. Service will resume tomorrow.'
    });
  }

  writeBudgetState(state);
  next();
}
