"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, BookmarkPlus, ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { getImageUrl } from "@/lib/api";

export default function CartPage() {
  const { items, removeItem, updateQuantity, toggleSaveForLater, totals } = useCartStore();
  const activeItems = items.filter((i) => !i.savedForLater);
  const savedItems = items.filter((i) => i.savedForLater);
  const t = totals();

  if (items.length === 0) {
    return (
      <div className="container-x py-24">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping bag is empty"
          description="Discover our autumn/winter collection crafted with pure organic textiles and quiet elegance."
          actionLabel="Explore Collections"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-x py-12 lg:py-16">
      {/* Header */}
      <div className="mb-12 border-b border-stone/50 pb-6 flex items-baseline justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest2 text-brass font-semibold">Atelier Bag</p>
          <h1 className="mt-1 font-editorial text-4xl sm:text-5xl font-light text-ink">Shopping Bag</h1>
        </div>
        <p className="text-xs font-mono text-ash font-medium">
          {activeItems.length} {activeItems.length === 1 ? "Item" : "Items"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
        {/* Active Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {activeItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex flex-col sm:flex-row gap-6 border-b border-stone/50 pb-6"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-[3/4] h-36 sm:h-40 w-28 sm:w-32 shrink-0 overflow-hidden bg-stone border border-stone/50">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>

              {/* Item Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-editorial text-lg font-medium text-ink">{item.title}</h3>
                      <p className="mt-1 text-xs text-ash tracking-wide font-mono">
                        Size: <span className="text-ink font-semibold">{item.size}</span> &middot; Color:{" "}
                        <span className="text-ink font-semibold">{item.color}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-semibold text-ink font-mono">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      {item.originalPrice && (
                        <p className="text-xs text-ash line-through font-mono">
                          {formatCurrency(item.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center border border-stone bg-paper-pure">
                    <button
                      className="px-3 py-1.5 text-graphite hover:text-ink transition-colors"
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-xs font-mono font-medium text-ink">{item.quantity}</span>
                    <button
                      className="px-3 py-1.5 text-graphite hover:text-ink transition-colors"
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-5 text-ash">
                    <button
                      onClick={() => toggleSaveForLater(item.productId, item.size, item.color)}
                      className="flex items-center gap-1.5 text-xs text-graphite hover:text-brass transition-colors font-medium"
                    >
                      <BookmarkPlus className="h-4 w-4 text-brass" />
                      <span>Save for later</span>
                    </button>
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-ash hover:text-error transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Saved Items */}
          {savedItems.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone/80">
              <h2 className="mb-6 font-editorial text-2xl text-ink font-light">Saved for Later</h2>
              <div className="space-y-4">
                {savedItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-5 border border-stone/50 bg-stone-light/30 p-4"
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone opacity-80">
                      <Image src={getImageUrl(item.image)} alt={item.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="font-editorial text-base text-ink font-medium">{item.title}</h4>
                        <p className="mt-0.5 text-xs text-ash font-mono">
                          Size: {item.size} &middot; Color: {item.color}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-ink">{formatCurrency(item.price)}</p>
                      </div>
                      <button
                        onClick={() => toggleSaveForLater(item.productId, item.size, item.color)}
                        className="w-fit text-xs uppercase tracking-luxury text-brass hover:text-ink font-semibold transition-colors hover-underline-gold"
                      >
                        Move Back to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-luxury text-ink hover:text-brass transition-colors hover-underline-gold"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Order Summary Column */}
        <div>
          <div className="sticky top-28">
            <CartSummary totals={t} />
            <Link href="/checkout" className="mt-4 block">
              <Button variant="gold" size="lg" className="w-full justify-center gap-2">
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

