import { Router, json, urlencoded } from 'express';
import { postChat, postSummary } from '../controllers/chatController.js';
import { postContact } from '../controllers/contactController.js';
import { chatRateLimiterMinute, chatRateLimiterHour, contactRateLimiter } from '../middlewares/rateLimiter.js';
import { apiKeyAuth } from '../middlewares/apiKeyAuth.js';
import { budgetGuard } from '../middlewares/budgetGuard.js';

const router = Router();

const chatParsers = [json({ limit: '50kb' }), urlencoded({ extended: true, limit: '50kb' })];
const contactParsers = [json({ limit: '20kb' }), urlencoded({ extended: true, limit: '20kb' })];

router.post('/chat', apiKeyAuth, budgetGuard, chatRateLimiterMinute, chatRateLimiterHour, ...chatParsers, postChat);
router.post('/chat/summary', apiKeyAuth, budgetGuard, chatRateLimiterMinute, chatRateLimiterHour, ...chatParsers, postSummary);
router.post('/contact', apiKeyAuth, budgetGuard, contactRateLimiter, ...contactParsers, postContact);

export default router;
