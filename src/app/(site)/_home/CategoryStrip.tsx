"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderTree } from "lucide-react";
import { categoryService, CategoryItem } from "@/services/categoryService";
import { getImageUrl } from "@/lib/api";

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  women: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
  men: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&auto=format&fit=crop&q=80",
  kids: "https://images.unsplash.com/photo-1519238263530-99afd11df2ea?w=600&auto=format&fit=crop&q=80",
  jeans: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
  accessories: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&auto=format&fit=crop&q=80",
  dresses: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
  shoes: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
};

export function CategoryStrip() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.getPublicCategories().then((res) => {
      setCategories(res.categories || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (!loading && categories.length === 0) return null;

  return (
    <section className="container-x py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-primary font-mono font-bold">SHOP BY CATEGORY</span>
        <h2 className="mt-1 font-editorial text-3xl sm:text-4xl text-ink font-bold">Featured Collections</h2>
        <div className="mt-2 h-0.5 w-16 bg-primary mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((c) => {
          const slug = c.slug || c.name.toLowerCase();
          const bgImg = c.image ? getImageUrl(c.image) : (DEFAULT_CATEGORY_IMAGES[slug] || DEFAULT_CATEGORY_IMAGES.women);
          return (
            <div
              key={c.id || c._id || c.name}
              className="group border-dashed-card bg-paper-pure p-4 flex flex-col items-center text-center shadow-xs transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone rounded mb-4">
                <Image
                  src={bgImg}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                />
              </div>
              <h3 className="font-editorial text-xl font-bold text-ink">{c.name}</h3>
              <p className="text-xs font-mono text-ash mt-1">{c.description || `Curated ${c.name} collection`}</p>
              <Link
                href={`/products?category=${slug}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-crimson-gradient px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-dark transition-all shadow-xs group-hover:shadow-crimson"
              >
                <span>Shop {c.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}



