import { FilterQuery } from 'mongoose';
import { Product, IProduct } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { getPaginationParams, buildPaginationMeta, PaginationMeta } from '../utils/pagination';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Product.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

export interface ProductListQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  featured?: string;
  newArrival?: string;
}

function buildSort(sort?: string): Record<string, 1 | -1> {
  switch (sort) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'newest':
      return { createdAt: -1 };
    default:
      return { createdAt: -1 };
  }
}

export const productService = {
  async list(query: ProductListQuery, options: { includeInactive?: boolean } = {}) {
    const { page, limit, skip } = getPaginationParams(query as Record<string, unknown>);

    const filter: FilterQuery<IProduct> = {};
    if (!options.includeInactive) {
      filter.isActive = true;
    }

    if (query.category) filter.category = query.category.toLowerCase();
    if (query.gender) filter.gender = query.gender;
    if (query.featured === 'true') filter.featured = true;
    if (query.newArrival === 'true') filter.newArrival = true;

    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
      if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const sort = buildSort(query.sort);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    const pagination: PaginationMeta = buildPaginationMeta(page, limit, total);
    return { products, pagination };
  },

  async getById(id: string, options: { includeInactive?: boolean } = {}): Promise<IProduct> {
    const product = await Product.findById(id);
    if (!product || (!options.includeInactive && !product.isActive)) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }
    return product;
  },

  async getBySlug(slug: string): Promise<IProduct> {
    const product = await Product.findOne({ slug, isActive: true });
    if (!product) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }
    return product;
  },

  async getByCategory(category: string, query: ProductListQuery) {
    return this.list({ ...query, category });
  },

  async create(data: Partial<IProduct>, createdBy: string): Promise<IProduct> {
    const slug = await generateUniqueSlug(data.title as string);
    const product = await Product.create({ ...data, slug, createdBy });
    return product;
  },

  async update(id: string, data: Partial<IProduct>): Promise<IProduct> {
    const product = await Product.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }

    if (data.title && data.title !== product.title) {
      data.slug = await generateUniqueSlug(data.title);
    }

    Object.assign(product, data);
    await product.save();
    return product;
  },

  async softDelete(id: string): Promise<IProduct> {
    const product = await Product.findById(id);
    if (!product) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }
    product.isActive = false;
    await product.save();
    return product;
  },

  async permanentDelete(id: string): Promise<void> {
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');
    }
  },
};
