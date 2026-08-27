import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { cartService } from '../services/cart.service';

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!._id.toString());
  sendSuccess(res, 200, 'Cart fetched', { cart });
});

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.addItem(req.user!._id.toString(), req.body);
  sendSuccess(res, 200, 'Item added to cart', { cart });
});

export const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.updateItem(req.user!._id.toString(), req.params.itemId, req.body.quantity);
  sendSuccess(res, 200, 'Cart item updated', { cart });
});

export const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.removeItem(req.user!._id.toString(), req.params.itemId);
  sendSuccess(res, 200, 'Cart item removed', { cart });
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await cartService.clearCart(req.user!._id.toString());
  sendSuccess(res, 200, 'Cart cleared', { cart });
});
