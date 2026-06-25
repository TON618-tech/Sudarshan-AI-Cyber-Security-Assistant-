import { isProduction } from '../config/env.js';
import { logSecurityEvent } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  
  if (status === 400 || status === 403 || status === 401) {
    let type = 'VALIDATION_FAILURE';
    if (err.message?.includes('security filters')) type = 'PROMPT_INJECTION_ATTEMPT';
    logSecurityEvent(type, req, { message: err.message, payloadPreview: JSON.stringify(req.body).substring(0, 200) });
  } else if (status === 500) {
    logSecurityEvent('SYSTEM_ERROR', req, { message: err.message, stack: err.stack });
    console.error(`[SERVER ERROR] ${err.message}`, err.stack);
  } else if (!isProduction) {
    console.error(err);
  }

  const message = (isProduction && status === 500)
    ? 'An unexpected error occurred. Please try again later.'
    : (err.message || 'Internal Server Error');

  res.status(status).json({ success: false, error: message });
}
