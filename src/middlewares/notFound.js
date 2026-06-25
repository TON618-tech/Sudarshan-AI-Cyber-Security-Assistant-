import createError from 'http-errors';
import { logSecurityEvent } from '../utils/logger.js';

export function notFoundHandler(req, res, next) {
  logSecurityEvent('NOT_FOUND', req, { method: req.method, url: req.originalUrl });
  next(createError(404, 'The requested resource was not found.'));
}
