import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { productService } from '../services/product.service';
import { storageService } from '../services/storage.service';
import { ApiError } from '../utils/ApiError';

export const listProducts = catchAsync(async (req: Request, res: Response) => {
  const { products, pagination } = await productService.list(req.query as never);
  sendSuccess(res, 200, 'Products fetched', { products }, pagination);
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getById(req.params.id);
  sendSuccess(res, 200, 'Product fetched', { product });
});

export const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getBySlug(req.params.slug);
  sendSuccess(res, 200, 'Product fetched', { product });
});

export const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
  const { products, pagination } = await productService.getByCategory(req.params.category, req.query as never);
  sendSuccess(res, 200, 'Products fetched', { products }, pagination);
});

function parseArrayField(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.length) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value.split(',').map((v) => v.trim()).filter(Boolean);
    }
  }
  return [];
}

function parseVariantsField(value: unknown): Array<{ size: string; color?: string; stock: number; sku?: string }> {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.length) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }
  return [];
}

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length === 0) {
    throw ApiError.badRequest('At least one product image is required', 'IMAGES_REQUIRED');
  }

  const uploaded = await Promise.all(files.map((file) => storageService.uploadImage(file, 'products')));
  const images = uploaded.map((img, idx) => ({
    url: img.url,
    publicId: img.publicId,
    alt: `${req.body.title} image ${idx + 1}`,
  }));

  const parsedVariants = parseVariantsField(req.body.variants);
  const calculatedStock = parsedVariants.length > 0
    ? parsedVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : parseInt(req.body.stock || '0', 10);

  const product = await productService.create(
    {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      subcategory: req.body.subcategory,
      gender: req.body.gender ? req.body.gender.toLowerCase() : 'unisex',
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
      discount: req.body.discount ? parseFloat(req.body.discount) : 0,
      stock: calculatedStock,
      sizes: parseArrayField(req.body.sizes),
      colors: parseArrayField(req.body.colors),
      variants: parsedVariants,
      images,
      featured: req.body.featured === 'true' || req.body.featured === true,
      newArrival: req.body.newArrival === 'true' || req.body.newArrival === true,
    },
    req.user!._id.toString()
  );

  sendSuccess(res, 201, 'Product created successfully', { product });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const updateData: Record<string, unknown> = { ...req.body };

  if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price as string);
  if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock as string, 10);
  if (updateData.discount !== undefined) updateData.discount = parseFloat(updateData.discount as string);
  if (updateData.originalPrice !== undefined) updateData.originalPrice = parseFloat(updateData.originalPrice as string);
  if (updateData.sizes !== undefined) updateData.sizes = parseArrayField(updateData.sizes);
  if (updateData.colors !== undefined) updateData.colors = parseArrayField(updateData.colors);
  if (updateData.variants !== undefined) {
    const vars = parseVariantsField(updateData.variants);
    updateData.variants = vars;
    if (vars.length > 0) {
      updateData.stock = vars.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    }
  }
  if (updateData.gender !== undefined) updateData.gender = (updateData.gender as string).toLowerCase();
  if (updateData.featured !== undefined) updateData.featured = updateData.featured === 'true' || updateData.featured === true;
  if (updateData.newArrival !== undefined) updateData.newArrival = updateData.newArrival === 'true' || updateData.newArrival === true;
  if (updateData.isActive !== undefined) updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;


  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length > 0) {
    const uploaded = await Promise.all(files.map((file) => storageService.uploadImage(file, 'products')));
    updateData.images = uploaded.map((img, idx) => ({
      url: img.url,
      publicId: img.publicId,
      alt: `${req.body.title || 'product'} image ${idx + 1}`,
    }));
  }

  const product = await productService.update(req.params.id, updateData);
  sendSuccess(res, 200, 'Product updated successfully', { product });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  // Soft delete by default (isActive = false) to preserve order history integrity.
  const permanent = req.query.permanent === 'true';
  if (permanent) {
    await productService.permanentDelete(req.params.id);
    sendSuccess(res, 200, 'Product permanently deleted');
    return;
  }
  const product = await productService.softDelete(req.params.id);
  sendSuccess(res, 200, 'Product deactivated successfully', { product });
});

export const listProductsAdmin = catchAsync(async (req: Request, res: Response) => {
  const { products, pagination } = await productService.list(req.query as never, { includeInactive: true });
  sendSuccess(res, 200, 'Products fetched', { products }, pagination);
});
