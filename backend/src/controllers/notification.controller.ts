import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';

export const listNotifications = catchAsync(async (_req: Request, res: Response) => {
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ read: false });
  sendSuccess(res, 200, 'Notifications retrieved', { notifications, unreadCount });
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!notification) throw ApiError.notFound('Notification not found');
  sendSuccess(res, 200, 'Notification marked as read', { notification });
});

export const markAllAsRead = catchAsync(async (_req: Request, res: Response) => {
  await Notification.updateMany({ read: false }, { read: true });
  sendSuccess(res, 200, 'All notifications marked as read');
});
