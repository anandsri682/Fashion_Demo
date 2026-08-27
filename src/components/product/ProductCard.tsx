"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/api";
import Link from "next/link";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/format";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { Badge } from "@/components/ui/Badge";
import { useState } from "react";
import { QuickViewModal } from "./QuickViewModal";

export function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggle } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);
  const wishlisted = isWishlisted(product.id);
  const [quickView, setQuickView] = useState(false);

  const primaryImage = getImageUrl(product.images[0]?.url || "");
  const secondaryImage = product.images[1] ? getImageUrl(product.images[1]?.url || "") : null;

  const calculatedDiscount =
    product.discountPercent ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : undefined);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.title,
      image: product.images[0]?.url || "",
      price: product.price,
      originalPrice: product.originalPrice,
      size: product.sizes[0] || "M",
      color: product.colors[0] || "Default",
      quantity: 1,
      maxQuantity: product.quantity || 10,
    });
    push(`Added ${product.title} to your bag`);
  }

  return (
    <>
      <div className="group relative flex flex-col transition-all duration-300">
        {/* Product Image Area */}
        <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-stone border border-stone/50 rounded-sm">
          <Link href={`/products/${product.id}`} className="block h-full w-full">
            <Image
              src={primaryImage}
              alt={product.images[0]?.alt || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
            />
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-700 ease-smooth group-hover:opacity-100"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1 pointer-events-none">
            {product.isNewArrival && (
              <span className="bg-ink text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shadow-xs">
                NEW
              </span>
            )}
            {calculatedDiscount && (
              <span className="bg-crimson-gradient text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shadow-xs">
                -{calculatedDiscount}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shadow-xs">
                FEATURED
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggle(product.id)}
            aria-label="Toggle wishlist"
            className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper-pure/90 backdrop-blur-xs text-ink transition-all duration-200 hover:scale-110 hover:bg-paper shadow-subtle"
          >
            <Heart
              className={
                wishlisted
                  ? "h-4 w-4 fill-primary text-primary animate-heartPulse"
                  : "h-4 w-4 text-graphite hover:text-primary transition-colors"
              }
            />
          </button>

          {/* Quick Action Overlay on Hover */}
          <div className="absolute inset-x-2 bottom-2 z-10 hidden translate-y-3 gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
            <button
              onClick={() => setQuickView(true)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-paper-pure/95 backdrop-blur-xs py-2 text-[11px] font-bold uppercase tracking-wider text-ink hover:bg-primary hover:text-white transition-all shadow-subtle rounded-xs"
            >
              <Eye className="h-3.5 w-3.5" /> Quick View
            </button>
            <button
              onClick={handleQuickAdd}
              className="flex items-center justify-center bg-primary text-white p-2 hover:bg-primary-dark transition-all shadow-subtle rounded-xs"
              title="Add to Bag"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-3 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-luxury font-bold text-primary">{product.category}</p>
              {product.gender && (
                <span className="text-[9px] uppercase tracking-wider text-ash font-mono">{product.gender}</span>
              )}
            </div>

            <Link href={`/products/${product.id}`} className="group-hover:text-primary transition-colors">
              <h3 className="mt-1 text-xs sm:text-sm font-semibold text-ink line-clamp-1">{product.title}</h3>
            </Link>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xs sm:text-sm font-bold text-ink">{formatCurrency(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-ash line-through font-mono">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
          </div>

          {/* Colors/Sizes hint */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-[10px] text-ash font-mono uppercase tracking-wide">
                Sizes: {product.sizes.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      <QuickViewModal product={product} open={quickView} isOpen={quickView} onClose={() => setQuickView(false)} />
    </>
  );
}


