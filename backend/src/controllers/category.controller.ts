import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Subcategory } from '../models/Subcategory';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';

export const listCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
  const subcategories = await Subcategory.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
  sendSuccess(res, 200, 'Categories retrieved', { categories, subcategories });
});

export const listAllAdminCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
  const subcategories = await Subcategory.find().populate('category', 'name').sort({ displayOrder: 1, name: 1 });
  sendSuccess(res, 200, 'Admin categories retrieved', { categories, subcategories });
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name, description, image, displayOrder, isActive } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const category = await Category.create({ name, slug, description, image, displayOrder, isActive });
  sendSuccess(res, 201, 'Category created', { category });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');
  if (req.body.name) {
    req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  Object.assign(category, req.body);
  await category.save();
  sendSuccess(res, 200, 'Category updated', { category });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');
  await Subcategory.deleteMany({ category: req.params.id });
  sendSuccess(res, 200, 'Category deleted');
});

export const createSubcategory = catchAsync(async (req: Request, res: Response) => {
  const { name, categoryId, displayOrder, isActive } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const subcategory = await Subcategory.create({ name, slug, category: categoryId, displayOrder, isActive });
  sendSuccess(res, 201, 'Subcategory created', { subcategory });
});

export const updateSubcategory = catchAsync(async (req: Request, res: Response) => {
  const subcategory = await Subcategory.findById(req.params.id);
  if (!subcategory) throw ApiError.notFound('Subcategory not found');
  if (req.body.name) {
    req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  Object.assign(subcategory, req.body);
  await subcategory.save();
  sendSuccess(res, 200, 'Subcategory updated', { subcategory });
});

export const deleteSubcategory = catchAsync(async (req: Request, res: Response) => {
  const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
  if (!subcategory) throw ApiError.notFound('Subcategory not found');
  sendSuccess(res, 200, 'Subcategory deleted');
});
