import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { orderService } from '../services/order.service';
import { userService } from '../services/user.service';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';

// ---- Orders ----

export const listOrders = catchAsync(async (req: Request, res: Response) => {
  const { orders, pagination } = await orderService.listForAdmin(req.query as never);
  sendSuccess(res, 200, 'Orders fetched', { orders }, pagination);
});

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getForAdmin(req.params.id);
  sendSuccess(res, 200, 'Order fetched', { order });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.updateStatus(req.params.id, req.body.status);
  sendSuccess(res, 200, 'Order status updated', { order });
});

export const updateOrderDeliveryDate = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.updateDeliveryDate(req.params.id, new Date(req.body.expectedDeliveryDate));
  sendSuccess(res, 200, 'Expected delivery date updated', { order });
});

// ---- Users ----

export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const { users, pagination } = await userService.listForAdmin(req.query as never);
  sendSuccess(res, 200, 'Users fetched', { users }, pagination);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getForAdmin(req.params.id);
  sendSuccess(res, 200, 'User fetched', { user });
});

export const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateStatus(req.params.id, req.body.isActive === true || req.body.isActive === 'true');
  sendSuccess(res, 200, 'User status updated', { user });
});

// ---- Dashboard ----

const LOW_STOCK_THRESHOLD = 5;

export const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const dateFilter: Record<string, unknown> = {};
  if (req.query.from || req.query.to) {
    const range: Record<string, Date> = {};
    if (req.query.from) range.$gte = new Date(String(req.query.from));
    if (req.query.to) range.$lte = new Date(String(req.query.to));
    dateFilter.createdAt = range;
  }

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueAgg,
    ordersByStatus,
    lowStockProducts,
    recentOrders,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments({ role: 'USER' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(dateFilter),
    // Revenue excludes cancelled orders
    Order.aggregate([
      { $match: { ...dateFilter, orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([{ $match: dateFilter }, { $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Product.find({ isActive: true, stock: { $lte: LOW_STOCK_THRESHOLD } })
      .select('title stock category images')
      .sort({ stock: 1 })
      .limit(10),
    Order.find(dateFilter).populate('user', 'firstName lastName email').sort({ createdAt: -1 }).limit(10),
    User.find({ role: 'USER' }).sort({ createdAt: -1 }).limit(10),
  ]);

  const statusCounts: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    PACKED: 0,
    SHIPPED: 0,
    OUT_FOR_DELIVERY: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };
  for (const row of ordersByStatus as { _id: string; count: number }[]) {
    statusCounts[row._id] = row.count;
  }

  sendSuccess(res, 200, 'Dashboard data fetched', {
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      pendingOrders: statusCounts.PENDING,
      confirmedOrders: statusCounts.CONFIRMED,
      processingOrders: statusCounts.PROCESSING,
      packedOrders: statusCounts.PACKED,
      shippedOrders: statusCounts.SHIPPED,
      outForDeliveryOrders: statusCounts.OUT_FOR_DELIVERY,
      deliveredOrders: statusCounts.DELIVERED,
      cancelledOrders: statusCounts.CANCELLED,
    },
    lowStockProducts,
    recentOrders,
    recentUsers,
  });
});
