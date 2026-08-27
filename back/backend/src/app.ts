import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import mongoose from 'mongoose';
import { env } from './config/env';
import routes from './routes/index';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware';

const app: Application = express();

// ---- Security & core middleware ----
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(mongoSanitize());

if (!env.isTest) {
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));
}

// Rate limit auth endpoints specifically to slow down brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    error: { code: 'RATE_LIMITED' },
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Serve locally uploaded product images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ---- Health check ----
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Fashion Store API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// ---- API routes ----
app.use('/api', routes);

// ---- 404 + error handling ----
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
