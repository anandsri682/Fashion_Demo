import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  storeDescription?: string;
  supportEmail: string;
  supportPhone?: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  taxPercentage: number;
  currency: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, required: true, default: 'Maison Noir' },
    storeDescription: { type: String, default: 'Haute Couture & Fine Apparel' },
    supportEmail: { type: String, required: true, default: 'support@maisonnoir.com' },
    supportPhone: { type: String, default: '+91 98765 43210' },
    freeShippingThreshold: { type: Number, required: true, default: 999 },
    standardShippingFee: { type: Number, required: true, default: 99 },
    taxPercentage: { type: Number, required: true, default: 5 },
    currency: { type: String, required: true, default: 'INR' },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
