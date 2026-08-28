"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categoryService, CategoryItem } from "@/services/categoryService";
import { getImageUrl } from "@/lib/api";

import { Sparkles, Tag, ShoppingBag } from "lucide-react";

export function CategoryScroller() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await categoryService.getPublicCategories();
        if (data && data.categories) {
          setCategories(data.categories);
        }
      } catch {
        // Handle gracefully
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-3 border-b border-slate-100 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 px-4 min-w-max">
        {categories.map((cat, idx) => {
          const imgUrl = cat.image ? getImageUrl(cat.image) : "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop&q=80";
          return (
            <Link
              key={cat.id || cat._id || (cat.name + idx)}
              href={`/products?category=${encodeURIComponent(cat.slug || cat.name)}`}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-rose-500 transition-all p-0.5 shadow-xs bg-slate-50">
                <div className="relative h-full w-full rounded-full overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={cat.name}
                    fill
                    sizes="56px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-700 group-hover:text-rose-600 tracking-tight text-center max-w-[64px] truncate">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

