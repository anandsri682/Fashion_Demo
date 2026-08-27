import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';

/**
 * 1. Read token
 * 2. Verify JWT
 * 3. Find user
 * 4. Attach user to request
 * 5. Continue
 */
export const authMiddleware = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authentication token is missing');
  }

  const token = header.split(' ')[1];

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw ApiError.unauthorized('User belonging to this token no longer exists');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('This account has been deactivated');
  }

  req.user = user;
  next();
});
