"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { getImageUrl } from "@/lib/api";

export default function WishlistPage() {
  const { productIds, toggle } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      return;
    }
    setProducts(null);
    Promise.all(productIds.map((id) => productService.getProduct(id))).then((res) => {
      setProducts(res.filter((p): p is Product => !!p));
    });
  }, [productIds]);

  function moveToCart(product: Product) {
    addItem({
      productId: product.id,
      title: product.title,
      image: getImageUrl(product.images[0]?.url || ""),
      price: product.price,
      originalPrice: product.originalPrice,
      size: product.sizes[0],
      color: product.colors[0],
      quantity: 1,
      maxQuantity: product.quantity,
    });
    toggle(product.id);
    push(`Moved "${product.title}" to your shopping bag`);
  }

  return (
    <div className="container-x py-12 lg:py-16">
      {/* Header */}
      <div className="mb-12 border-b border-stone/50 pb-6 flex items-baseline justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest2 text-brass font-semibold">Private Ledger</p>
          <h1 className="mt-1 font-editorial text-4xl sm:text-5xl font-light text-ink">My Wishlist</h1>
        </div>
        {products && (
          <p className="text-xs font-mono text-ash font-medium">
            {products.length} Saved {products.length === 1 ? "Creation" : "Creations"}
          </p>
        )}
      </div>

      {products === null && <ProductGridSkeleton />}

      {products !== null && products.length === 0 && (
        <div className="py-16">
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Explore our collections and click the heart icon on any creation to save it to your private ledger."
            actionLabel="Explore Collections"
            actionHref="/products"
          />
        </div>
      )}

      {products !== null && products.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-12">
          {products.map((p) => (
            <div key={p.id} className="group relative flex flex-col justify-between border border-stone/40 p-3 bg-paper hover:border-brass/40 transition-all duration-300 shadow-xs">
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                  <Link href={`/products/${p.id}`}>
                    <Image
                      src={getImageUrl(p.images[0]?.url || "")}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => toggle(p.id)}
                    aria-label="Remove from wishlist"
                    className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center bg-paper/90 backdrop-blur-xs text-graphite hover:text-error transition-colors shadow-xs"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <Link href={`/products/${p.id}`} className="mt-3 block">
                  <span className="text-[10px] font-semibold uppercase tracking-luxury text-brass">{p.category}</span>
                  <h3 className="mt-0.5 font-editorial text-base font-medium text-ink group-hover:text-brass transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <span className="mt-1 block font-mono text-sm font-semibold text-ink">{formatCurrency(p.price)}</span>
                </Link>
              </div>

              <Button
                size="sm"
                variant="gold"
                className="mt-4 w-full justify-center gap-1.5 text-[11px]"
                onClick={() => moveToCart(p)}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Move to Bag</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

