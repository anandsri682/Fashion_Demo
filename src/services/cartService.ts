import { apiFetch } from "@/lib/api";
import { CartItem } from "@/types";

interface BackendCartResponse {
  success: boolean;
  message: string;
  cart: {
    _id: string;
    user: string;
    items: Array<{
      _id: string;
      product: {
        _id: string;
        title: string;
        price: number;
        images?: Array<{ url: string }>;
        stock: number;
        slug?: string;
      };
      quantity: number;
      size?: string;
      color?: string;
      price: number;
    }>;
  };
}

function mapCartItem(item: any): CartItem {
  const p = item.product || {};
  return {
    productId: p._id || item.product,
    title: p.title || "Product",
    image: p.images?.[0]?.url || "",
    price: item.price || p.price || 0,
    quantity: item.quantity,
    maxQuantity: p.stock ?? 99,
    size: item.size || "",
    color: item.color || "",
  };
}

export const cartService = {
  async fetchCart(): Promise<CartItem[]> {
    try {
      const res = await apiFetch<BackendCartResponse>("/cart");
      return (res.cart?.items || []).map(mapCartItem);
    } catch {
      return [];
    }
  },

  async addItem(productId: string, quantity: number, size?: string, color?: string): Promise<CartItem[]> {
    const res = await apiFetch<BackendCartResponse>("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, size, color }),
    });
    return (res.cart?.items || []).map(mapCartItem);
  },

  async updateQuantity(itemId: string, quantity: number): Promise<CartItem[]> {
    const res = await apiFetch<BackendCartResponse>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    return (res.cart?.items || []).map(mapCartItem);
  },

  async removeItem(itemId: string): Promise<CartItem[]> {
    const res = await apiFetch<BackendCartResponse>(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
    return (res.cart?.items || []).map(mapCartItem);
  },

  async clearCart(): Promise<void> {
    try {
      await apiFetch("/cart", { method: "DELETE" });
    } catch {
      // Ignore if already empty
    }
  },
};

