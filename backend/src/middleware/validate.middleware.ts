import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError';

/**
 * Runs after express-validator chains; collects and formats validation errors.
 */
export function validate(req: Request, _res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map((err) => ({
    field: 'path' in err ? err.path : undefined,
    message: err.msg,
  }));

  throw ApiError.unprocessable('Validation failed', 'VALIDATION_ERROR', formatted);
}
