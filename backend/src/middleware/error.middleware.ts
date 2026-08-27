import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

/**
 * Centralized error handler. Normalizes Mongoose/JWT/Multer/validation
 * errors into the standard { success: false, message, error: { code } }
 * response shape and never leaks stack traces outside development.
 */
export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    details = err.details;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => e.message);
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Invalid value for field '${err.path}'`;
  } else if (err && typeof err === 'object' && 'code' in err && (err as { code: unknown }).code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_KEY';
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    const field = keyValue ? Object.keys(keyValue)[0] : 'field';
    message = `${field} already exists`;
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    code = `UPLOAD_${err.code}`;
    message = err.message;
  } else if (err && typeof err === 'object' && 'name' in err) {
    const name = (err as { name: string }).name;
    if (name === 'JsonWebTokenError') {
      statusCode = 401;
      code = 'INVALID_TOKEN';
      message = 'Invalid authentication token';
    } else if (name === 'TokenExpiredError') {
      statusCode = 401;
      code = 'TOKEN_EXPIRED';
      message = 'Authentication token has expired';
    }
  }

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(`[error] ${req.method} ${req.originalUrl}:`, err);
  }

  const body: Record<string, unknown> = {
    success: false,
    message,
    error: { code, ...(details ? { details } : {}) },
  };

  if (!env.isProduction && err instanceof Error) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: { code: 'ROUTE_NOT_FOUND' },
  });
}
