import mongoose, { Schema, Document } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
}

const SubcategorySchema = new Schema<ISubcategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SubcategorySchema.index({ name: 1, category: 1 }, { unique: true });

export const Subcategory = mongoose.model<ISubcategory>('Subcategory', SubcategorySchema);
