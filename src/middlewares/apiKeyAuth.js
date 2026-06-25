import crypto from 'crypto';
import { env, isProduction } from '../config/env.js';
import { logSecurityEvent } from '../utils/logger.js';

const MAX_TIMESTAMP_DRIFT_SECONDS = 30;

export function apiKeyAuth(req, res, next) {
  // In development, if no API_SECRET_KEY is configured, skip auth
  if (!isProduction && !env.apiSecretKey) {
    console.warn('[SECURITY] API_SECRET_KEY is not set — skipping request authentication in development mode.');
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  const timestamp = req.headers['x-request-timestamp'];
  const signature = req.headers['x-request-signature'];

  // All three headers are required
  if (!apiKey || !timestamp || !signature) {
    logSecurityEvent('AUTH_FAILURE', req, { reason: 'Missing authentication headers' });
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  // Validate API key matches
  if (apiKey !== env.apiSecretKey) {
    logSecurityEvent('AUTH_FAILURE', req, { reason: 'Invalid API key' });
    return res.status(403).json({ success: false, error: 'Invalid authentication credentials.' });
  }

  // Replay protection: reject if timestamp is too old
  const ts = Number(timestamp);
  if (isNaN(ts) || Math.abs(Date.now() / 1000 - ts) > MAX_TIMESTAMP_DRIFT_SECONDS) {
    logSecurityEvent('AUTH_FAILURE', req, { reason: 'Timestamp expired or invalid', timestamp });
    return res.status(403).json({ success: false, error: 'Invalid authentication credentials.' });
  }

  // Verify HMAC-SHA256 signature
  const signaturePayload = `${timestamp}:${req.method}:${req.path}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.apiSecretKey)
    .update(signaturePayload)
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    logSecurityEvent('AUTH_FAILURE', req, { reason: 'Invalid request signature' });
    return res.status(403).json({ success: false, error: 'Invalid authentication credentials.' });
  }

  next();
}
