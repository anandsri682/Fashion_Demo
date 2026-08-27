import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { orderService } from '../services/order.service';

import { Address } from '../models/Address';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  let shippingAddressId = req.body.shippingAddressId;
  let billingAddressId = req.body.billingAddressId;

  if (!shippingAddressId && req.body.shippingAddress) {
    const addr = await Address.create({
      ...req.body.shippingAddress,
      user: userId,
    });
    shippingAddressId = addr._id.toString();
  }

  if (!billingAddressId && req.body.billingAddress) {
    const addr = await Address.create({
      ...req.body.billingAddress,
      user: userId,
    });
    billingAddressId = addr._id.toString();
  }

  if (!billingAddressId) {
    billingAddressId = shippingAddressId;
  }

  const order = await orderService.createOrder(userId, {
    items: (req.body.items || []).map((i: { productId: string; quantity: number; size?: string; color?: string }) => ({
      productId: i.productId,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
    })),
    shippingAddressId,
    billingAddressId,
    paymentMethod: req.body.paymentMethod,
    notes: req.body.notes,
  });

  sendSuccess(res, 201, 'Order placed successfully', { order });
});


export const listMyOrders = catchAsync(async (req: Request, res: Response) => {
  const { orders, pagination } = await orderService.listForUser(req.user!._id.toString(), req.query as never);
  sendSuccess(res, 200, 'Orders fetched', { orders }, pagination);
});

export const getMyOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getForUser(req.user!._id.toString(), req.params.id);
  sendSuccess(res, 200, 'Order fetched', { order });
});

export const cancelMyOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.cancelForUser(req.user!._id.toString(), req.params.id);
  sendSuccess(res, 200, 'Order cancelled successfully', { order });
});
