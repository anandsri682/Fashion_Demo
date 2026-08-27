"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/format";
import { getImageUrl } from "@/lib/api";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const FREE_SHIPPING_MIN = 999;

interface CartDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, isOpen, onClose }: CartDrawerProps) {
  const isDrawerOpen = open ?? isOpen ?? false;
  const router = useRouter();
  const { items, removeItem, updateQuantity, totals } = useCartStore();

  const activeItems = items.filter((i) => !i.savedForLater);
  const t = totals({ freeShippingThreshold: FREE_SHIPPING_MIN });
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_MIN - t.subtotal);
  const progressPercent = Math.min(100, Math.round((t.subtotal / FREE_SHIPPING_MIN) * 100));

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;


  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/60 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-paper-pure shadow-dropdown flex flex-col transition-transform duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone/40 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="font-editorial text-lg font-bold text-ink uppercase tracking-wider">
                Shopping Bag ({activeItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-light/60 text-ink hover:bg-primary hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="font-body text-graphite font-medium">
                Add <span className="font-bold text-primary">{formatCurrency(remainingForFreeShipping)}</span> more to unlock <span className="font-semibold text-primary">FREE Shipping</span>!
              </p>
            ) : (
              <p className="font-body text-primary font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 shrink-0" /> Congratulations! You unlocked FREE Express Shipping!
              </p>
            )}
            <div className="mt-2 h-1.5 w-full bg-stone/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-crimson-gradient transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-stone/30">
            {activeItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-medium text-ink">Your bag is currently empty</h3>
                  <p className="mt-1 text-xs text-ash font-body">Explore our collection and add your favorite pieces.</p>
                </div>
                <Button
                  onClick={() => {
                    onClose();
                    router.push("/products");
                  }}
                  variant="primary"
                  className="mt-2"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              activeItems.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="pt-4 first:pt-0 flex gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-stone border border-stone/40 rounded-sm">
                    <Image src={getImageUrl(item.image)} alt={item.title} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-body text-xs font-bold text-ink line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => removeItem(item.productId, item.size, item.color)}
                          className="text-ash hover:text-primary transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-ash font-mono mt-0.5">
                        {item.size} &middot; {item.color}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone rounded">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-ink hover:bg-stone-light"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-ink hover:bg-stone-light"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-xs font-bold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {activeItems.length > 0 && (
            <div className="border-t border-stone/40 p-6 bg-paper space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-graphite">
                  <span>Subtotal</span>
                  <span>{formatCurrency(t.subtotal)}</span>
                </div>
                <div className="flex justify-between text-graphite">
                  <span>Estimated Shipping</span>
                  <span>{t.shipping === 0 ? "FREE" : formatCurrency(t.shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-stone/40 pt-2 text-sm text-ink font-bold">
                  <span>Subtotal Amount</span>
                  <span className="text-primary">{formatCurrency(t.subtotal + t.shipping)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    router.push("/cart");
                  }}
                  className="w-full text-xs"
                >
                  View Bag
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    router.push("/checkout");
                  }}
                  className="w-full text-xs group"
                >
                  Checkout <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <p className="flex items-center justify-center gap-1 text-[10px] text-ash font-mono text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Guaranteed 256-Bit Encrypted Secure Checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
