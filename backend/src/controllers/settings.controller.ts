import { Request, Response } from 'express';
import { Settings } from '../models/Settings';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';

export const getSettings = catchAsync(async (_req: Request, res: Response) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      storeName: 'Maison Noir',
      storeDescription: 'Haute Couture & Fine Apparel',
      supportEmail: 'support@maisonnoir.com',
      supportPhone: '+91 98765 43210',
      freeShippingThreshold: 999,
      standardShippingFee: 99,
      taxPercentage: 5,
      currency: 'INR',
    });
  }
  sendSuccess(res, 200, 'Settings retrieved', { settings });
});

export const updateSettings = catchAsync(async (req: Request, res: Response) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(req.body);
  } else {
    Object.assign(settings, req.body);
  }
  await settings.save();
  sendSuccess(res, 200, 'Settings updated', { settings });
});
