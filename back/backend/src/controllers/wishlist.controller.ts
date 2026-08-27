import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { Wishlist } from '../models/Wishlist';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';

async function getOrCreateWishlist(userId: string) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
}

export const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findOne({ _id: req.params.productId, isActive: true });
  if (!product) throw ApiError.notFound('Product not found', 'PRODUCT_NOT_FOUND');

  const wishlist = await getOrCreateWishlist(req.user!._id.toString());
  const alreadyExists = wishlist.products.some((p) => p.toString() === req.params.productId);
  if (!alreadyExists) {
    wishlist.products.push(product._id);
    await wishlist.save();
  }
  await wishlist.populate('products', 'title price images slug stock isActive');
  sendSuccess(res, 200, 'Product added to wishlist', { wishlist });
});

export const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const wishlist = await getOrCreateWishlist(req.user!._id.toString());
  await wishlist.populate('products', 'title price images slug stock isActive');
  sendSuccess(res, 200, 'Wishlist fetched', { wishlist });
});

export const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const wishlist = await getOrCreateWishlist(req.user!._id.toString());
  wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId) as never;
  await wishlist.save();
  await wishlist.populate('products', 'title price images slug stock isActive');
  sendSuccess(res, 200, 'Product removed from wishlist', { wishlist });
});
