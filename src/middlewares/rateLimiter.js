import rateLimit from 'express-rate-limit';
import { logSecurityEvent } from '../utils/logger.js';

const handler = (req, res, next, options) => {
  logSecurityEvent('RATE_LIMIT_VIOLATION', req, { path: req.originalUrl, limit: options.max });
  res.status(options.statusCode).send(options.message);
};

export const chatRateLimiterMinute = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  message: {
    success: false,
    error: 'Rate limit exceeded: 20 requests per minute allowed.'
  }
});

export const chatRateLimiterHour = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  message: {
    success: false,
    error: 'Rate limit exceeded: 100 requests per hour allowed.'
  }
});

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  message: {
    success: false,
    error: 'Too many contact form submissions. Please try again after an hour.'
  }
});

export const globalBudgetProtector = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10000, // 10,000 requests per day globally across all IPs
  keyGenerator: () => 'global_budget',
  handler: (req, res, next, options) => {
    logSecurityEvent('GLOBAL_BUDGET_EXHAUSTION', req, { path: req.originalUrl });
    res.status(503).json({ success: false, error: 'Platform is currently experiencing extreme demand. Please try again later.' });
  }
});
