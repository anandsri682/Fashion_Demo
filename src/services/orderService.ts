import { apiFetch } from "@/lib/api";
import { CreateOrderPayload, Order, OrderStatus } from "@/types";

interface OrderResponse {
  success: boolean;
  message: string;
  order: any;
}

interface OrderListResponse {
  success: boolean;
  message: string;
  orders: any[];
}

function normalizeOrderStatus(status: string): OrderStatus {
  switch (status?.toUpperCase()) {
    case "CONFIRMED":
      return "Confirmed";
    case "PROCESSING":
      return "Processing";
    case "PACKED":
      return "Packed";
    case "SHIPPED":
      return "Shipped";
    case "OUT_FOR_DELIVERY":
      return "Out for Delivery";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Pending";
  }
}

function mapOrder(backendOrder: any): Order {
  if (!backendOrder) return null as unknown as Order;
  const user = backendOrder.user || {};
  return {
    id: backendOrder._id || backendOrder.id || backendOrder.orderNumber,
    userId: typeof user === "string" ? user : user._id || backendOrder.userId || "",
    customerName: typeof user === "object" && user.firstName ? `${user.firstName} ${user.lastName}` : backendOrder.customerName || "Customer",
    customerEmail: typeof user === "object" ? user.email || "" : backendOrder.customerEmail || "",
    customerPhone: typeof user === "object" ? user.phone || "" : backendOrder.customerPhone || "",
    items: (backendOrder.items || []).map((item: any) => ({
      productId: item.product?._id || item.product || item.productId,
      title: item.title,
      image: item.image || item.product?.images?.[0]?.url || "",
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    })),
    shippingAddress: backendOrder.shippingAddress || {},
    billingAddress: backendOrder.billingAddress || {},
    paymentMethod: backendOrder.paymentMethod || "UPI",
    subtotal: backendOrder.subtotal,
    discount: backendOrder.discount || 0,
    shipping: backendOrder.shipping || 0,
    tax: backendOrder.tax || 0,
    total: backendOrder.total,
    status: normalizeOrderStatus(backendOrder.orderStatus || backendOrder.status),
    createdAt: backendOrder.createdAt,
    expectedDelivery: backendOrder.expectedDeliveryDate || backendOrder.expectedDelivery || backendOrder.createdAt,
  };
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload, customer: { name: string; email: string; phone: string }): Promise<Order> {
    const res = await apiFetch<OrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
      }),
    });
    return mapOrder(res.order);
  },

  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const path = userId ? "/orders" : "/admin/orders";
      const res = await apiFetch<OrderListResponse>(path);
      return (res.orders || []).map(mapOrder);
    } catch {
      return [];
    }
  },

  async getOrder(id: string): Promise<Order | null> {
    try {
      // Try user order endpoint first, fallback to admin endpoint
      let res: OrderResponse;
      try {
        res = await apiFetch<OrderResponse>(`/orders/${id}`);
      } catch {
        res = await apiFetch<OrderResponse>(`/admin/orders/${id}`);
      }
      return mapOrder(res.order);
    } catch {
      return null;
    }
  },

  async updateOrderStatus(id: string, status: OrderStatus, expectedDelivery?: string): Promise<Order> {
    // Backend expects status string matching OrderStatus enum (e.g. DELIVERED, SHIPPED)
    const backendStatusMap: Record<string, string> = {
      Pending: "PENDING",
      Confirmed: "CONFIRMED",
      Processing: "PROCESSING",
      Packed: "PACKED",
      Shipped: "SHIPPED",
      "Out for Delivery": "OUT_FOR_DELIVERY",
      Delivered: "DELIVERED",
      Cancelled: "CANCELLED",
    };

    const statusValue = backendStatusMap[status] || status;

    const res = await apiFetch<OrderResponse>(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: statusValue, expectedDelivery }),
    });
    return mapOrder(res.order);
  },
};

