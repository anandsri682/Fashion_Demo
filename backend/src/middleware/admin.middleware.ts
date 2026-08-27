import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Must run after authMiddleware. Checks role === ADMIN.
 * Never trusts role from request body/query/params — only the authenticated user record.
 */
export function adminMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }
  if (req.user.role !== 'ADMIN') {
    throw ApiError.forbidden('Admin access required');
  }
  next();
}
