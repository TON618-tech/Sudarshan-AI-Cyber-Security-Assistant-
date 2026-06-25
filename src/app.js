import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import crypto from 'crypto';

import { env, isProduction } from './config/env.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFoundHandler } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.set('trust proxy', 1);

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'no-referrer' },
  xFrameOptions: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xContentTypeOptions: true
}));

app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
  next();
});
const allowedOrigins = env.corsOrigin.split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      if (isProduction) return callback(new Error('Origin required in production'));
      return callback(null, true);
    }
    if (allowedOrigins.includes('*')) { if (isProduction) return callback(new Error('Wildcard CORS is not permitted in production')); return callback(null, true); }
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));

// Global json parsing removed - applied per-route instead
app.use(hpp()); // HTTP Parameter Pollution protection
app.use(morgan(isProduction ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(chatRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

export default app;
