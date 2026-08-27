"use client";

import { Product } from "@/types";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { getImageUrl } from "@/lib/api";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function QuickViewModal({
  product,
  open,
  isOpen,
  onClose,
}: {
  product: Product;
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
}) {
  const isModalOpen = open ?? isOpen ?? false;
  const [size, setSize] = useState(product.sizes[0] || "M");
  const [color, setColor] = useState(product.colors[0] || "Default");
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);

  function handleAdd() {
    addItem({
      productId: product.id,
      title: product.title,
      image: getImageUrl(product.images[0]?.url || ""),
      price: product.price,
      originalPrice: product.originalPrice,
      size,
      color,
      quantity: 1,
      maxQuantity: product.quantity || 10,
    });
    push(`Added "${product.title}" (${size} / ${color}) to your bag`);
    onClose();
  }

  return (
    <Modal open={isModalOpen} onClose={onClose} title={product.title}>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Product Image */}
        <div className="relative aspect-[3/4] w-full sm:w-44 shrink-0 overflow-hidden bg-stone border border-stone/50">
          <Image
            src={getImageUrl(product.images[0]?.url || "")}
            alt={product.title}
            fill
            className="object-cover"
            sizes="176px"
          />
        </div>

        {/* Product Options */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-luxury text-brass">{product.category}</span>
            <h3 className="font-editorial text-lg font-medium text-ink mt-0.5">{product.title}</h3>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-base font-semibold text-ink">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-ash line-through">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>

            {/* Size Selector */}
            <div className="mt-4">
              <p className="text-[10px] uppercase font-semibold tracking-luxury text-graphite mb-2">
                Select Size: <span className="text-ink">{size}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`border px-3 py-1.5 text-xs font-mono transition-all ${size === s
                        ? "border-brass bg-brass/10 text-brass font-bold"
                        : "border-stone text-graphite hover:border-graphite"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] uppercase font-semibold tracking-luxury text-graphite mb-2">
                  Color: <span className="text-ink">{color}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`border px-3 py-1.5 text-xs transition-all ${color === c
                          ? "border-ink bg-ink text-paper"
                          : "border-stone text-graphite hover:border-graphite"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone/50">
        <Button variant="gold" size="md" className="flex-1 justify-center gap-2" onClick={handleAdd}>
          <ShoppingBag className="h-4 w-4" />
          <span>Add to Bag</span>
        </Button>
        <Link href={`/products/${product.id}`} className="flex-1" onClick={onClose}>
          <Button variant="outline" size="md" className="w-full justify-center gap-1.5">
            <span>View Full Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </Modal>
  );
}

