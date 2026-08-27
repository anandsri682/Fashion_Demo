import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { authService } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/User';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.register(req.body);
  sendSuccess(res, 201, 'Registration successful', { user, token });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body);
  sendSuccess(res, 200, 'Login successful', { user, token });
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  // Stateless JWT: logout is handled client-side by discarding the token.
  // This endpoint exists for API completeness and future token-blacklisting.
  sendSuccess(res, 200, 'Logout successful');
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  sendSuccess(res, 200, 'Current user fetched', { user: req.user });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  // Always respond the same way whether or not the user exists, to avoid
  // leaking which emails are registered.
  if (user) {
    // In production this would generate a reset token and email it to the user.
    // Left as an integration point since no email provider was specified for this demo.
  }

  sendSuccess(res, 200, 'If an account with that email exists, a reset link has been sent');
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  // Placeholder for token-based reset flow; requires an email provider to be wired up.
  throw ApiError.badRequest('Password reset via token is not configured for this demo environment', 'NOT_IMPLEMENTED');
});
