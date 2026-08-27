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
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 rounded-2xl border border-slate-100 shadow-xs group-hover:shadow-md transition-all duration-300">
          <Link href={`/products/${product.id}`} className="block h-full w-full">
            <Image
              src={primaryImage}
              alt={product.images[0]?.alt || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </Link>

          {/* Badges Top-Left */}
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 pointer-events-none">
            {calculatedDiscount ? (
              <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs tracking-tight">
                -{calculatedDiscount}%
              </span>
            ) : product.isNewArrival ? (
              <span className="bg-slate-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs tracking-tight">
                NEW
              </span>
            ) : null}
          </div>

          {/* Wishlist Button Top-Right */}
          <button
            onClick={() => toggle(product.id)}
            aria-label="Toggle wishlist"
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-700 transition-all duration-200 hover:scale-110 shadow-sm"
          >
            <Heart
              className={
                wishlisted
                  ? "h-4 w-4 fill-rose-600 text-rose-600 animate-heartPulse"
                  : "h-4 w-4 text-slate-600 hover:text-rose-600 transition-colors"
              }
            />
          </button>
        </div>

        {/* Product Details */}
        <div className="mt-2.5 flex flex-col flex-1 justify-between px-0.5">
          <div>
            <Link href={`/products/${product.id}`} className="group-hover:text-rose-600 transition-colors">
              <h3 className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-1 tracking-tight">{product.title}</h3>
            </Link>

            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-slate-900">{formatCurrency(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through font-mono">{formatCurrency(product.originalPrice)}</span>
              )}
              {calculatedDiscount && (
                <span className="text-[10px] font-bold text-rose-600">-{calculatedDiscount}%</span>
              )}
            </div>

            {/* Rating Pill */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                <span>{product.rating || "4.2"}</span>
                <span className="text-[9px]">★</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">({product.reviewCount || 128})</span>

            </div>
          </div>
        </div>

      </div>

      <QuickViewModal product={product} open={quickView} isOpen={quickView} onClose={() => setQuickView(false)} />
    </>
  );
}


