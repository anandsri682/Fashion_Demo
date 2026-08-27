import { Schema, model, Document, Types } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  price: number;
  originalPrice?: number;
  discount: number;
  stock: number;
  sizes: string[];
  colors: string[];
  images: IProductImage[];
  featured: boolean;
  newArrival: boolean;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    subcategory: { type: String, trim: true, lowercase: true },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    images: { type: [productImageSchema], default: [] },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ title: 'text', description: 'text', category: 'text', subcategory: 'text' });

export const Product = model<IProduct>('Product', productSchema);
