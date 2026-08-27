"use client";

import { Product } from "@/types";
import { ProductGallery } from "@/components/product/ProductGallery";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Heart, Star, Truck, RotateCcw, ShieldCheck, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useToastStore } from "@/store/toastStore";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { getImageUrl } from "@/lib/api";

import { ProductShare } from "@/components/product/ProductShare";

export function ProductDetails({ product, related }: { product: Product; related: Product[] }) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [tab, setTab] = useState<"details" | "shipping">("details");

  const addItem = useCartStore((s) => s.addItem);
  const { isWishlisted, toggle } = useWishlistStore();
  const push = useToastStore((s) => s.push);
  const router = useRouter();
  const wishlisted = isWishlisted(product.id);

  const selectedVariant = size ? product.variants?.find((v) => v.size === size) : null;
  const availableStock = selectedVariant ? selectedVariant.stock : product.quantity;
  const isOutOfStock = size ? availableStock === 0 : product.quantity === 0;

  function handleAddToCart() {
    if (!size) {
      setSizeError(true);
      return;
    }
    if (isOutOfStock) {
      push(`Size ${size} is currently out of stock.`, "error");
      return;
    }
    addItem({
      productId: product.id,
      title: product.title,
      image: getImageUrl(product.images[0]?.url || ""),
      price: product.price,
      originalPrice: product.originalPrice,
      size,
      color,
      quantity,
      maxQuantity: availableStock,
    });
    push(`Added "${product.title}" (${size} / ${color}) to your bag`);
  }

  function handleBuyNow() {
    if (!size) {
      setSizeError(true);
      return;
    }
    if (isOutOfStock) {
      push(`Size ${size} is currently out of stock.`, "error");
      return;
    }
    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="container-x py-12 lg:py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Gallery Column */}
        <ProductGallery images={product.images} title={product.title} />

        {/* Product Info Column */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Category & Atelier Tag & Share */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                {product.category} {product.subcategory ? `• ${product.subcategory}` : ""} &middot; Atelier Collection
              </span>
              <div className="flex items-center gap-3">
                {product.isNewArrival && <Badge variant="primary">NEW ARRIVAL</Badge>}
                <ProductShare title={product.title} />
              </div>
            </div>

            {/* Title */}
            <h1 className="mt-2 font-editorial text-3xl sm:text-4xl lg:text-5xl font-light text-ink leading-tight">
              {product.title}
            </h1>

            {/* Reviews */}
            {product.rating && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-brass">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" fill={i < Math.round(product.rating!) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-xs text-ash tracking-wide font-mono">({product.reviewCount} Reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3 pb-6 border-b border-stone/50">
              <span className="text-2xl font-semibold text-ink">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-ash line-through">{formatCurrency(product.originalPrice)}</span>
                  <Badge variant="default">Save {product.discountPercent}%</Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-xs sm:text-sm leading-relaxed text-graphite font-body">{product.description}</p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-luxury text-graphite">
                    Color Selection: <span className="text-ink font-bold">{color}</span>
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "border px-4 py-2 text-xs transition-all duration-200",
                        color === c
                          ? "border-ink bg-ink text-paper font-medium"
                          : "border-stone text-graphite hover:border-graphite bg-paper"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-luxury text-graphite">
                  Select Size: {size ? <span className="text-ink font-bold">{size}</span> : <span className="text-ash font-normal">Select a size</span>}
                  {sizeError && <span className="text-error font-medium ml-2">— Required</span>}
                </p>
                <span className="text-[10px] text-ash tracking-wide font-mono">
                  {size
                    ? availableStock > 0
                      ? `${availableStock} units in size ${size}`
                      : `Out of Stock in size ${size}`
                    : `${product.quantity} total units`}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const sVar = product.variants?.find((v) => v.size === s);
                  const sStock = sVar ? sVar.stock : product.quantity;
                  const sOutOfStock = sStock === 0;

                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setSize(s);
                        setSizeError(false);
                        setQuantity(1);
                      }}
                      className={cn(
                        "h-11 min-w-[50px] px-3 border text-xs font-mono transition-all duration-200 relative",
                        size === s
                          ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary shadow-xs"
                          : sOutOfStock
                          ? "border-stone/40 bg-stone/20 text-ash line-through opacity-60"
                          : "border-stone text-ink hover:border-graphite bg-paper"
                      )}
                    >
                      {s}
                      {sOutOfStock && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-error" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-luxury text-graphite">Quantity</p>
              <div className="flex w-fit items-center border border-stone bg-paper-pure">
                <button
                  className="px-4 py-2 text-graphite hover:text-ink transition-colors disabled:opacity-40"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={isOutOfStock}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-4 text-xs font-mono font-medium text-ink">{quantity}</span>
                <button
                  className="px-4 py-2 text-graphite hover:text-ink transition-colors disabled:opacity-40"
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  disabled={isOutOfStock || quantity >= availableStock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                variant="gold"
                size="lg"
                className="flex-1 justify-center gap-2 disabled:opacity-50"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{isOutOfStock ? "Out of Stock" : "Add to Bag"}</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 justify-center disabled:opacity-50"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
              >
                <span>Buy Now</span>
              </Button>
              <button
                onClick={() => toggle(product.id)}
                aria-label="Toggle wishlist"
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-stone bg-paper hover:border-brass transition-all"
              >
                <Heart className={wishlisted ? "h-5 w-5 fill-brass text-brass" : "h-5 w-5 text-graphite"} />
              </button>
            </div>
          </div>


          {/* Guarantees */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone/60 pt-6 text-xs text-graphite">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-brass shrink-0" />
              <span>Complimentary shipping on orders over ₹3,000</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-brass shrink-0" />
              <span>Effortless 30-day return policy</span>
            </div>
          </div>

          {/* Details & Shipping Accordion Tabs */}
          <div className="mt-8 border-t border-stone/60 pt-6">
            <div className="flex gap-8 border-b border-stone/50 pb-2 text-xs uppercase tracking-luxury font-semibold">
              <button
                onClick={() => setTab("details")}
                className={cn(
                  "pb-2 transition-colors relative",
                  tab === "details" ? "text-brass font-bold" : "text-ash hover:text-ink"
                )}
              >
                Details & Care
                {tab === "details" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brass" />}
              </button>
              <button
                onClick={() => setTab("shipping")}
                className={cn(
                  "pb-2 transition-colors relative",
                  tab === "shipping" ? "text-brass font-bold" : "text-ash hover:text-ink"
                )}
              >
                Shipping & Atelier Guarantee
                {tab === "shipping" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brass" />}
              </button>
            </div>

            <div className="mt-4 text-xs leading-relaxed text-graphite font-body">
              {tab === "details" ? (
                <ul className="space-y-2 list-disc pl-4">
                  {product.material && <li><strong className="text-ink">Material:</strong> {product.material}</li>}
                  <li><strong className="text-ink">Care Instructions:</strong> {product.careInstructions}</li>
                  <li>Tailored in small batch workshops adhering to high environmental standards.</li>
                </ul>
              ) : (
                <ul className="space-y-2 list-disc pl-4">
                  <li>Standard trackable courier delivery in 3–5 business days.</li>
                  <li>Complimentary insured shipping on all orders over ₹3,000.</li>
                  <li>Returns accepted within 30 days of receipt provided items remain unworn with original tags attached.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Rail */}
      {related.length > 0 && (
        <section className="mt-24 pt-12 border-t border-stone/60">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-widest2 text-brass font-semibold">Complete The Edit</p>
            <h2 className="mt-1 font-editorial text-2xl sm:text-3xl text-ink font-semibold">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

