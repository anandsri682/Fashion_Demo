import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';
import { orderService } from '../services/order.service';
import { userService } from '../services/user.service';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';


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
  const deliveryDateRaw = req.body.expectedDelivery || req.body.expectedDeliveryDate;
  const deliveryDate = deliveryDateRaw ? new Date(deliveryDateRaw) : undefined;
  const order = await orderService.updateStatus(req.params.id, req.body.status, deliveryDate);
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

export const updateProductStock = catchAsync(async (req: Request, res: Response) => {
  const { stock } = req.body;
  if (stock === undefined || Number(stock) < 0) {
    throw ApiError.badRequest('Valid non-negative stock quantity required');
  }
  const product = await Product.findByIdAndUpdate(req.params.id, { stock: Number(stock) }, { new: true });
  if (!product) throw ApiError.notFound('Product not found');
  sendSuccess(res, 200, 'Product stock updated', { product });
});

export const updateAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('Admin user not found');

  const { firstName, lastName, email, phone, password } = req.body;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (password && password.length >= 6) {
    user.password = password; // Pre-save hook hashes password
  }
  await user.save();
  sendSuccess(res, 200, 'Admin profile updated', {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// ---- Dashboard Analytics ----

const LOW_STOCK_THRESHOLD = 10;

export const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const period = String(req.query.period || 'ALL');
  const now = new Date();
  const dateFilter: Record<string, unknown> = {};

  if (period === 'TODAY') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateFilter.createdAt = { $gte: startOfDay };
  } else if (period === '7_DAYS') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter.createdAt = { $gte: sevenDaysAgo };
  } else if (period === '30_DAYS') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter.createdAt = { $gte: thirtyDaysAgo };
  } else if (period === 'THIS_YEAR') {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    dateFilter.createdAt = { $gte: startOfYear };
  }

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueAgg,
    ordersByStatus,
    lowStockProducts,
    outOfStockProducts,
    recentOrders,
    recentUsers,
    recentProducts,
    bestSellersAgg,
  ] = await Promise.all([
    User.countDocuments({ role: 'USER' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(dateFilter),
    Order.aggregate([
      { $match: { ...dateFilter, orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([{ $match: dateFilter }, { $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Product.find({ isActive: true, stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD } })
      .select('title stock category price images')
      .sort({ stock: 1 }),
    Product.find({ isActive: true, stock: { $eq: 0 } })
      .select('title stock category price images')
      .sort({ updatedAt: -1 }),
    Order.find(dateFilter).populate('user', 'firstName lastName email').sort({ createdAt: -1 }).limit(10),
    User.find({ role: 'USER' }).sort({ createdAt: -1 }).limit(10),
    Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(8),
    Order.aggregate([
      { $match: { ...dateFilter, orderStatus: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          unitsSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
    ]),
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

  // Aggregate customer details with total spend & order count
  const customerListWithStats = await Promise.all(
    recentUsers.map(async (u) => {
      const userOrders = await Order.find({ user: u.id, orderStatus: { $ne: 'CANCELLED' } });
      const totalSpend = userOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        createdAt: u.createdAt,
        orderCount: userOrders.length,
        totalSpend,
      };
    })
  );

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
    outOfStockProducts,
    recentOrders,
    recentUsers: customerListWithStats,
    recentProducts,
    bestSellingProducts: bestSellersAgg,
  });
});

