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

function toAddressSnapshot(addr: InstanceType<typeof Address>) {
  return {
    firstName: addr.firstName,
    lastName: addr.lastName,
    phone: addr.phone,
    email: addr.email,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2,
    city: addr.city,
    state: addr.state,
    country: addr.country,
    pincode: addr.pincode,
    landmark: addr.landmark,
  };
}

export const orderService = {
  async createOrder(userId: string, input: CreateOrderInput): Promise<IOrder> {
    const session = await mongoose.startSession();

    try {
      let createdOrder: IOrder | undefined;

      await session.withTransaction(async () => {
        // 1-2. Validate items exist
        if (!input.items.length) {
          throw ApiError.badRequest('Order must contain at least one item', 'EMPTY_ORDER');
        }

        // 3-9. Fetch products, validate stock/size/color, compute snapshot pricing
        const orderItems: IOrder['items'] = [];
        let subtotal = 0;

        for (const item of input.items) {
          // eslint-disable-next-line no-await-in-loop
          const product = await Product.findById(item.productId).session(session);

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

          // 19. Decrease product stock (guarded against going negative)
          // eslint-disable-next-line no-await-in-loop
          const stockUpdate = await Product.updateOne(
            { _id: product._id, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } }
          ).session(session);

          if (stockUpdate.matchedCount === 0) {
            throw ApiError.badRequest(`Insufficient stock for '${product.title}'`, 'INSUFFICIENT_STOCK');
          }
        }

        // 10-13. Calculate discount, shipping, tax, total (server-derived only)
        const discount = 0; // reserved for future coupon support
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
        const tax = Math.round((subtotal - discount) * TAX_RATE * 100) / 100;
        const total = Math.round((subtotal - discount + shipping + tax) * 100) / 100;

        // 15-16. Fetch and verify shipping/billing addresses belong to this user
        const [shippingAddress, billingAddress] = await Promise.all([
          Address.findOne({ _id: input.shippingAddressId, user: userId }).session(session),
          Address.findOne({ _id: input.billingAddressId, user: userId }).session(session),
        ]);

        if (!shippingAddress) {
          throw ApiError.badRequest('Shipping address not found', 'ADDRESS_NOT_FOUND');
        }
        if (!billingAddress) {
          throw ApiError.badRequest('Billing address not found', 'ADDRESS_NOT_FOUND');
        }

        // 17, 21-22. Generate order number + expected delivery date
        const orderNumber = await generateOrderNumber();
        const expectedDeliveryDate = calculateExpectedDeliveryDate();

        // 18. Create order with item snapshots
        const [order] = await Order.create(
          [
            {
              orderNumber,
              user: userId,
              items: orderItems,
              shippingAddress: toAddressSnapshot(shippingAddress),
              billingAddress: toAddressSnapshot(billingAddress),
              paymentMethod: input.paymentMethod,
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
            },
          ],
          { session }
        );

        // 20. Clear the user's cart
        await Cart.updateOne({ user: userId }, { $set: { items: [] } }).session(session);

        createdOrder = order;
      });

      if (!createdOrder) {
        throw ApiError.internal('Order could not be created');
      }

      return createdOrder;
    } finally {
      await session.endSession();
    }
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
    const session = await mongoose.startSession();
    try {
      let updated: IOrder | undefined;

      await session.withTransaction(async () => {
        const order = await Order.findOne({ _id: orderId, user: userId }).session(session);
        if (!order) {
          throw ApiError.notFound('Order not found', 'ORDER_NOT_FOUND');
        }

        const nonCancellable: OrderStatus[] = ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
        if (nonCancellable.includes(order.orderStatus)) {
          throw ApiError.badRequest(`Order cannot be cancelled once it is ${order.orderStatus}`, 'ORDER_NOT_CANCELLABLE');
        }

        // Restock items
        for (const item of order.items) {
          // eslint-disable-next-line no-await-in-loop
          await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }).session(session);
        }

        order.orderStatus = 'CANCELLED';
        order.statusHistory.push({ status: 'CANCELLED', changedAt: new Date() });
        if (order.paymentStatus === 'PAID' || order.paymentStatus === 'COD_COLLECTED') {
          order.paymentStatus = 'REFUNDED';
        }
        await order.save({ session });
        updated = order;
      });

      if (!updated) throw ApiError.internal('Order could not be cancelled');
      return updated;
    } finally {
      await session.endSession();
    }
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

  async updateStatus(orderId: string, status: OrderStatus): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }
    order.orderStatus = status;
    order.statusHistory.push({ status, changedAt: new Date() });

    if (status === 'DELIVERED' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'COD_COLLECTED';
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
