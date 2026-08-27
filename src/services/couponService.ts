import { api } from '@/lib/api';

export interface CouponItem {
  id: string;
  _id?: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface CouponValidationResult {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  calculatedDiscount: number;
}

export const couponService = {
  async validateCoupon(code: string, cartSubtotal: number): Promise<CouponValidationResult> {
    const res = await api.post<CouponValidationResult>('/coupons/validate', { code, cartSubtotal });
    return res;
  },

  async listCoupons(): Promise<CouponItem[]> {
    const res = await api.get<{ coupons: CouponItem[] }>('/admin/coupons');
    return res.coupons;
  },

  async createCoupon(data: Partial<CouponItem>): Promise<CouponItem> {
    const res = await api.post<{ coupon: CouponItem }>('/admin/coupons', data);
    return res.coupon;
  },

  async updateCoupon(id: string, data: Partial<CouponItem>): Promise<CouponItem> {
    const res = await api.put<{ coupon: CouponItem }>(`/admin/coupons/${id}`, data);
    return res.coupon;
  },

  async deleteCoupon(id: string): Promise<void> {
    await api.delete(`/admin/coupons/${id}`);
  },
};
