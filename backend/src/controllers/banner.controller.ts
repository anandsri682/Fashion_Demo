import { Request, Response } from 'express';
import { Banner } from '../models/Banner';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';

export const listPublicBanners = catchAsync(async (_req: Request, res: Response) => {
  const banners = await Banner.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
  sendSuccess(res, 200, 'Banners retrieved', { banners });
});

export const listAllAdminBanners = catchAsync(async (_req: Request, res: Response) => {
  const banners = await Banner.find().sort({ displayOrder: 1, createdAt: -1 });
  sendSuccess(res, 200, 'Admin banners retrieved', { banners });
});

export const createBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await Banner.create(req.body);
  sendSuccess(res, 201, 'Banner created', { banner });
});

export const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!banner) throw ApiError.notFound('Banner not found');
  sendSuccess(res, 200, 'Banner updated', { banner });
});

export const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw ApiError.notFound('Banner not found');
  sendSuccess(res, 200, 'Banner deleted');
});
