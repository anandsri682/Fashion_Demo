import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';

export const validateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, cartSubtotal } = req.body;
  if (!code) throw ApiError.badRequest('Coupon code is required');

  const coupon = await Coupon.findOne({ code: String(code).toUpperCase(), isActive: true });
  if (!coupon) throw ApiError.badRequest('Invalid or expired coupon code');

  const now = new Date();
  if (coupon.startDate && new Date(coupon.startDate) > now) {
    throw ApiError.badRequest('Coupon is not active yet');
  }
  if (coupon.endDate && new Date(coupon.endDate) < now) {
    throw ApiError.badRequest('Coupon has expired');
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw ApiError.badRequest('Coupon usage limit reached');
  }
  if (cartSubtotal !== undefined && cartSubtotal < coupon.minOrderAmount) {
    throw ApiError.badRequest(`Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`);
  }

  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    discount = coupon.discountValue;
  }

  sendSuccess(res, 200, 'Coupon applied successfully', {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    calculatedDiscount: discount,
  });
});

export const listCoupons = catchAsync(async (_req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  sendSuccess(res, 200, 'Coupons retrieved', { coupons });
});

export const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await Coupon.create(req.body);
  sendSuccess(res, 201, 'Coupon created', { coupon });
});

export const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) throw ApiError.notFound('Coupon not found');
  sendSuccess(res, 200, 'Coupon updated', { coupon });
});

export const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw ApiError.notFound('Coupon not found');
  sendSuccess(res, 200, 'Coupon deleted');
});
