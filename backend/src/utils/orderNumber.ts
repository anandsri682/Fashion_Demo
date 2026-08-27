import { Order } from '../models/Order';

/**
 * Generates a human-friendly, sortable order number, e.g. ORD-20260810-00125.
 * Uses a per-day counter derived from how many orders already exist for the day
 * to avoid exposing the raw Mongo ObjectId as the only identifier.
 */
export async function generateOrderNumber(): Promise<string> {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const countToday = await Order.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  const sequence = String(countToday + 1).padStart(5, '0');
  const candidate = `ORD-${datePart}-${sequence}`;

  // Extremely unlikely collision guard (e.g. concurrent order creation)
  const exists = await Order.exists({ orderNumber: candidate });
  if (exists) {
    const fallbackSequence = String(countToday + 1 + Math.floor(Math.random() * 1000)).padStart(5, '0');
    return `ORD-${datePart}-${fallbackSequence}`;
  }

  return candidate;
}
