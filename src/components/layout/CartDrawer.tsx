"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShoppingBag } from "lucide-react";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, totals } = useCartStore();
  const activeItems = items.filter((i) => !i.savedForLater);
  const t = totals();
  const freeShippingThreshold = 3000;
  const progressToFreeShipping = Math.min(100, (t.subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - t.subtotal);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-paper shadow-elevation border-l border-stone/50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-stone/60 px-6 py-5 bg-stone-light/40">
              <div>
                <h2 className="font-editorial text-lg text-ink font-semibold tracking-wide">Shopping Bag</h2>
                <p className="text-[10px] uppercase tracking-luxury text-brass font-medium">
                  {activeItems.length} {activeItems.length === 1 ? "item" : "items"} selected
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart drawer"
                className="p-1.5 text-ink hover:text-brass transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-stone-light/60 px-6 py-3 border-b border-stone/50 text-xs">
              <div className="flex items-center justify-between text-graphite mb-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-medium">
                  <Truck className="h-3.5 w-3.5 text-brass" />
                  {remainingForFreeShipping > 0 ? (
                    <>Add <span className="font-semibold text-ink">{formatCurrency(remainingForFreeShipping)}</span> for Free Delivery</>
                  ) : (
                    <span className="text-brass font-semibold">You unlocked Free Delivery!</span>
                  )}
                </span>
                <span className="text-[10px] font-mono text-ash">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="h-1 w-full bg-stone overflow-hidden rounded-full">
                <div
                  className="h-full bg-brass transition-all duration-500 ease-out"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Content Area */}
            {activeItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <EmptyState
                  icon={ShoppingBag}
                  title="Your bag is empty"
                  description="Explore our latest arrivals and build your considered wardrobe."
                  actionLabel="Explore Collection"
                  actionHref="/products"
                />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone/40">
                {activeItems.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 py-5 group">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone border border-stone/60">
                      <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="80px" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-xs font-semibold text-ink tracking-wide line-clamp-1">{item.title}</p>
                          <button
                            onClick={() => removeItem(item.productId, item.size, item.color)}
                            className="text-ash hover:text-error transition-colors p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-1 text-[11px] text-ash tracking-wide">
                          Size: <span className="text-graphite font-medium">{item.size}</span> &middot; Color: <span className="text-graphite font-medium">{item.color}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone bg-paper-pure">
                          <button
                            className="px-2 py-1 text-graphite hover:text-ink transition-colors"
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-ink">{item.quantity}</span>
                          <button
                            className="px-2 py-1 text-graphite hover:text-ink transition-colors"
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-ink">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Summary */}
            {activeItems.length > 0 && (
              <div className="border-t border-stone/60 bg-stone-light/40 px-6 py-5">
                <div className="mb-2 flex items-center justify-between text-xs text-graphite">
                  <span>Subtotal</span>
                  <span className="text-sm font-semibold text-ink">{formatCurrency(t.subtotal)}</span>
                </div>
                <p className="text-[10px] text-ash mb-4">Taxes and shipping calculated at checkout.</p>

                <div className="flex flex-col gap-2">
                  <Link href="/checkout" onClick={onClose} className="w-full">
                    <Button variant="gold" size="lg" className="w-full justify-between">
                      <span>Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={onClose} className="w-full">
                    <Button variant="outline" size="md" className="w-full">
                      View Full Bag
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

