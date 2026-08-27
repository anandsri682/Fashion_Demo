import mongoose, { Schema, Document } from 'mongoose';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface ICoupon extends Document {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true, default: 'PERCENTAGE' },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, required: true, default: 0 },
    maxDiscountAmount: { type: Number },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
