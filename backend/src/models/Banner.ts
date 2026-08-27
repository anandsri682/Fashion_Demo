import mongoose, { Schema, Document } from 'mongoose';

export type BannerType = 'HERO' | 'PROMO' | 'CATEGORY';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image: string;
  bannerType: BannerType;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    ctaText: { type: String, default: 'Shop Now' },
    ctaLink: { type: String, default: '/products' },
    image: { type: String, required: true },
    bannerType: { type: String, enum: ['HERO', 'PROMO', 'CATEGORY'], default: 'HERO' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Banner = mongoose.model<IBanner>('Banner', BannerSchema);
