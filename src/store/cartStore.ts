"use client";

// ---------------------------------------------------------------------------
// Cart state store. Persists to localStorage so the cart survives page
// navigation and refreshes. Backed by cartService for the future server-sync
// point — see syncCart() calls below.
// ---------------------------------------------------------------------------

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartTotals } from "@/types";
import { cartService } from "@/services/cartService";

interface CartState {
  items: CartItem[];
  appliedCoupon: { code: string; discount: number } | null;
  setAppliedCoupon: (code: string, discount: number) => void;
  clearCoupon: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  toggleSaveForLater: (productId: string, size: string, color: string) => void;
  clearCart: () => void;
  totals: (opts?: { freeShippingThreshold?: number }) => CartTotals;
  itemCount: () => number;
}

function sameLine(a: CartItem, productId: string, size: string, color: string) {
  return a.productId === productId && a.size === size && a.color === color;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      setAppliedCoupon: (code, discount) => set({ appliedCoupon: { code, discount } }),
      clearCoupon: () => set({ appliedCoupon: null }),

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.size, item.color)
          );
          let items: CartItem[];
          if (existing) {
            items = state.items.map((i) =>
              sameLine(i, item.productId, item.size, item.color)
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxQuantity) }
                : i
            );
          } else {
            items = [...state.items, item];
          }
          cartService.addItem(item.productId, item.quantity, item.size, item.color).catch(() => {});
          return { items };
        });
      },

      removeItem: (productId, size, color) => {
        set((state) => {
          const items = state.items.filter((i) => !sameLine(i, productId, size, color));
          cartService.removeItem(productId).catch(() => {});
          return { items };
        });
      },

      updateQuantity: (productId, size, color, quantity) => {
        set((state) => {
          const items = state.items.map((i) =>
            sameLine(i, productId, size, color)
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) }
              : i
          );
          cartService.updateQuantity(productId, quantity).catch(() => {});
          return { items };
        });
      },

      toggleSaveForLater: (productId, size, color) => {
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, size, color) ? { ...i, savedForLater: !i.savedForLater } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
        cartService.clearCart().catch(() => {});
      },

      itemCount: () => {
        return get()
          .items.filter((i) => !i.savedForLater)
          .reduce((sum, i) => sum + i.quantity, 0);
      },

      totals: (opts) => {
        const active = get().items.filter((i) => !i.savedForLater);
        const subtotal = active.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const couponDiscount = get().appliedCoupon?.discount || 0;
        const discount = Math.min(subtotal, couponDiscount);
        const threshold = opts?.freeShippingThreshold ?? 999;
        const shipping = subtotal === 0 || subtotal >= threshold ? 0 : 99;
        const tax = Math.round((subtotal - discount) * 0.05);
        const total = Math.max(0, subtotal - discount + shipping + tax);
        return { subtotal, discount, shipping, tax, total };
      },
    }),
    { name: "fashion-store-cart" }
  )
);

