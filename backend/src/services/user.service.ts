import { User } from '../models/User';
import { Order } from '../models/Order';
import { ApiError } from '../utils/ApiError';
import { getPaginationParams, buildPaginationMeta } from '../utils/pagination';

export const userService = {
  async listForAdmin(query: Record<string, unknown>) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter: Record<string, unknown> = { role: 'USER' };
    if (query.search) {
      const regex = { $regex: String(query.search), $options: 'i' };
      filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    // Enrich with order count / total spending without N+1 queries
    const userIds = users.map((u) => u._id);
    const stats = await Order.aggregate([
      { $match: { user: { $in: userIds }, orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpending: { $sum: '$total' } } },
    ]);
    const statsMap = new Map(stats.map((s) => [s._id.toString(), s]));

    const enriched = users.map((u) => {
      const s = statsMap.get(u._id.toString());
      return {
        ...u.toJSON(),
        orderCount: s?.orderCount || 0,
        totalSpending: s?.totalSpending || 0,
      };
    });

    return { users: enriched, pagination: buildPaginationMeta(page, limit, total) };
  },

  async getForAdmin(userId: string) {
    const user = await User.findOne({ _id: userId, role: 'USER' });
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }

    const stats = await Order.aggregate([
      { $match: { user: user._id, orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpending: { $sum: '$total' } } },
    ]);

    return {
      ...user.toJSON(),
      orderCount: stats[0]?.orderCount || 0,
      totalSpending: stats[0]?.totalSpending || 0,
    };
  },

  async updateStatus(userId: string, isActive: boolean) {
    const user = await User.findOne({ _id: userId, role: 'USER' });
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }
    user.isActive = isActive;
    await user.save();
    return user;
  },
};
