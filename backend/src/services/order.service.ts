import mongoose from 'mongoose';
import { Order, IOrder, OrderStatus } from '../models/Order';
import { Product } from '../models/Product';
import { Address } from '../models/Address';
import { Cart } from '../models/Cart';
import { ApiError } from '../utils/ApiError';
import { generateOrderNumber } from '../utils/orderNumber';
import { calculateExpectedDeliveryDate } from '../utils/deliveryDate';
import { getPaginationParams, buildPaginationMeta } from '../utils/pagination';

interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CreateOrderInput {
  items: CreateOrderItemInput[];
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'COD';
  notes?: string;
}

// Simple, transparent business rules for shipping/tax — kept in one place
// so they're easy for the client to tune post-demo.
const FREE_SHIPPING_THRESHOLD = 2000;
const FLAT_SHIPPING_FEE = 99;
const TAX_RATE = 0.05; // 5%

function toAddressSnapshot(addr: any) {
  if (!addr) return {} as any;
  return {
    firstName: addr.firstName || '',
    lastName: addr.lastName || '',
    phone: addr.phone || '',
    email: addr.email || '',
    addressLine1: addr.addressLine1 || '',
    addressLine2: addr.addressLine2 || '',
    city: addr.city || '',
    state: addr.state || '',
    country: addr.country || 'India',
    pincode: addr.pincode || '',
    landmark: addr.landmark || '',
  };
}

export const orderService = {
  async createOrder(userId: string, input: CreateOrderInput & { shippingAddress?: any; billingAddress?: any }): Promise<IOrder> {
    // 1. Validate items exist
    if (!input.items || !input.items.length) {
      throw ApiError.badRequest('Order must contain at least one item', 'EMPTY_ORDER');
    }

    // 2. Fetch products, validate stock/size/color, compute snapshot pricing
    const orderItems: IOrder['items'] = [];
    let subtotal = 0;

    for (const item of input.items) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        throw ApiError.badRequest(`Product ${item.productId} is not available`, 'PRODUCT_NOT_FOUND');
      }
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(
          `Insufficient stock for '${product.title}'. Only ${product.stock} left.`,
          'INSUFFICIENT_STOCK'
        );
      }
      if (item.size && product.sizes.length > 0 && !product.sizes.includes(item.size)) {
        throw ApiError.badRequest(`Size '${item.size}' is not available for '${product.title}'`, 'INVALID_SIZE');
      }
      if (item.color && product.colors.length > 0 && !product.colors.includes(item.color)) {
        throw ApiError.badRequest(`Color '${item.color}' is not available for '${product.title}'`, 'INVALID_COLOR');
      }

      // Prices always come from the database — never trust the frontend.
      const lineSubtotal = product.price * item.quantity;
      subtotal += lineSubtotal;

      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.images[0]?.url || '',
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        subtotal: lineSubtotal,
      } as IOrder['items'][number]);

      // Decrease product stock (guarded against going negative)
      await Product.updateOne(
        { _id: product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    }

    // 3. Calculate discount, shipping, tax, total (server-derived only)
    const discount = 0;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
    const tax = Math.round((subtotal - discount) * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal - discount + shipping + tax) * 100) / 100;

    // 4. Resolve shipping & billing addresses
    let shippingAddress = input.shippingAddressId
      ? await Address.findOne({ _id: input.shippingAddressId, user: userId })
      : null;
    if (!shippingAddress && input.shippingAddress) {
      shippingAddress = input.shippingAddress;
    }

    let billingAddress = input.billingAddressId
      ? await Address.findOne({ _id: input.billingAddressId, user: userId })
      : null;
    if (!billingAddress && input.billingAddress) {
      billingAddress = input.billingAddress;
    }

    if (!billingAddress) {
      billingAddress = shippingAddress;
    }

    if (!shippingAddress) {
      throw ApiError.badRequest('Shipping address not found', 'ADDRESS_NOT_FOUND');
    }

    // 5. Generate order number + expected delivery date
    const orderNumber = await generateOrderNumber();
    const expectedDeliveryDate = calculateExpectedDeliveryDate();

    // 6. Create order in MongoDB
    const order = await Order.create({
      orderNumber,
      user: userId,
      items: orderItems,
      shippingAddress: toAddressSnapshot(shippingAddress),
      billingAddress: toAddressSnapshot(billingAddress),
      paymentMethod: input.paymentMethod || 'COD',
      paymentStatus: input.paymentMethod === 'COD' ? 'COD_PENDING' : 'PENDING',
      orderStatus: 'PENDING',
      subtotal,
      discount,
      shipping,
      tax,
      total,
      expectedDeliveryDate,
      notes: input.notes,
      statusHistory: [{ status: 'PENDING', changedAt: new Date() }],
    });

    // 7. Clear the user's cart in MongoDB
    await Cart.updateOne({ user: userId }, { $set: { items: [] } });

    // 8. Create real Admin Notification in MongoDB
    try {
      const { Notification } = await import('../models/Notification');
      await Notification.create({
        title: 'New Order Received',
        message: `Order #${order.orderNumber} placed for ₹${order.total}`,
        type: 'ORDER',
        link: `/admin/orders/${order._id}`,
      });
    } catch {
      // Ignore notification creation errors
    }

    return order;
  },



  async listForUser(userId: string, query: Record<string, unknown>) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = { user: userId };

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    return { orders, pagination: buildPaginationMeta(page, limit, total) };
  },

  async getForUser(userId: string, orderId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw ApiError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }
    return order;
  },

  async cancelForUser(userId: string, orderId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw ApiError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }

    const nonCancellable: OrderStatus[] = ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (nonCancellable.includes(order.orderStatus)) {
      throw ApiError.badRequest(`Order cannot be cancelled once it is ${order.orderStatus}`, 'ORDER_NOT_CANCELLABLE');
    }

    // Restock items in MongoDB
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }

    order.orderStatus = 'CANCELLED';
    order.statusHistory.push({ status: 'CANCELLED', changedAt: new Date() });
    if (order.paymentStatus === 'PAID' || order.paymentStatus === 'COD_COLLECTED') {
      order.paymentStatus = 'REFUNDED';
    }
    await order.save();
    return order;
  },

  // ---- Admin operations ----

  async listForAdmin(query: Record<string, unknown>) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter: Record<string, unknown> = {};

    if (query.status) filter.orderStatus = query.status;
    if (query.search) filter.orderNumber = { $regex: String(query.search), $options: 'i' };

    const sort: Record<string, 1 | -1> = query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'firstName lastName email phone').sort(sort).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    return { orders, pagination: buildPaginationMeta(page, limit, total) };
  },

  async getForAdmin(orderId: string): Promise<IOrder> {
    const order = await Order.findById(orderId).populate('user', 'firstName lastName email phone');
    if (!order) {
      throw ApiError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }
    return order;
  },

  async updateStatus(orderId: string, status: OrderStatus, expectedDeliveryDate?: Date): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;
    order.statusHistory.push({ status, changedAt: new Date() });

    if (expectedDeliveryDate && !isNaN(expectedDeliveryDate.getTime())) {
      order.expectedDeliveryDate = expectedDeliveryDate;
    }

    if (status === 'DELIVERED' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'COD_COLLECTED';
    }

    // If order is cancelled by Admin, restore stock if not previously cancelled
    if (status === 'CANCELLED' && previousStatus !== 'CANCELLED') {
      for (const item of order.items) {
        await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
      }
      if (order.paymentStatus === 'PAID' || order.paymentStatus === 'COD_COLLECTED') {
        order.paymentStatus = 'REFUNDED';
      }
    }

    await order.save();
    return order;
  },



  async updateDeliveryDate(orderId: string, expectedDeliveryDate: Date): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }
    order.expectedDeliveryDate = expectedDeliveryDate;
    await order.save();
    return order;
  },
};
