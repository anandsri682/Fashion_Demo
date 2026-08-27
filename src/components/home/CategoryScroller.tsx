"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categoryService, CategoryItem } from "@/services/categoryService";
import { getImageUrl } from "@/lib/api";

import { Sparkles, Tag, ShoppingBag } from "lucide-react";

const fallbackCategories = [
  { name: "Men", slug: "men", gender: "Men", iconUrl: "/uploads/seed/oxford-shirt.jpg" },
  { name: "Women", slug: "women", gender: "Women", iconUrl: "/uploads/seed/wrap-dress.jpg" },
  { name: "Kids", slug: "kids", gender: "Kids", iconUrl: "/uploads/seed/canvas-sneakers.jpg" },
  { name: "Shirts", slug: "shirts", iconUrl: "/uploads/seed/oxford-shirt.jpg" },
  { name: "T-Shirts", slug: "t-shirts", iconUrl: "/uploads/seed/denim-jeans.jpg" },
  { name: "Pants", slug: "pants", iconUrl: "/uploads/seed/denim-jeans.jpg" },
  { name: "Jeans", slug: "jeans", iconUrl: "/uploads/seed/denim-jeans.jpg" },
  { name: "Dresses", slug: "dresses", iconUrl: "/uploads/seed/wrap-dress.jpg" },
];

export function CategoryScroller() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function load() {
      try {
        const data = await categoryService.getPublicCategories();
        if (data && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch {

        // Fallback gracefully if API is offline
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const itemsToDisplay = categories.length > 0
    ? categories.map((cat) => ({
        name: cat.name,
        href: `/products?category=${cat.slug}`,
        image: cat.image ? getImageUrl(cat.image) : "/uploads/seed/oxford-shirt.jpg",
      }))
    : fallbackCategories.map((cat) => ({
        name: cat.name,
        href: cat.gender ? `/products?gender=${cat.gender}` : `/products?category=${cat.slug}`,
        image: cat.iconUrl,
      }));

  return (
    <div className="w-full bg-white py-3 border-b border-slate-100 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 px-4 min-w-max">
        {itemsToDisplay.map((item, idx) => (
          <Link
            key={item.name + idx}
            href={item.href}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-rose-500 transition-all p-0.5 shadow-xs bg-slate-50">
              <div className="relative h-full w-full rounded-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-700 group-hover:text-rose-600 tracking-tight text-center max-w-[64px] truncate">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
