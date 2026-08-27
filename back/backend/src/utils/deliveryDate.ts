import { env } from '../config/env';

/**
 * Calculates an expected delivery date from a given order date.
 * Defaults to DEFAULT_DELIVERY_DAYS from config (env.DEFAULT_DELIVERY_DAYS).
 */
export function calculateExpectedDeliveryDate(orderDate: Date = new Date(), days: number = env.DEFAULT_DELIVERY_DAYS): Date {
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate;
}
