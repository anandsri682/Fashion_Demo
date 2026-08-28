"use client";

import { CATEGORIES, SIZES } from "@/data/mockData";
import { ProductQuery } from "@/types";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { RotateCcw } from "lucide-react";

export function ProductFilters({
  query,
  onChange,
}: {
  query: ProductQuery;
  onChange: (q: ProductQuery) => void;
}) {
  const hasActiveFilters = Boolean(query.category || query.sizes?.length || query.minPrice !== undefined || query.sort !== "featured");

  return (
    <div className="flex flex-col gap-8 bg-paper-pure p-6 border border-stone/60 shadow-subtle rounded-xl">
      {/* Header with Clear Action */}
      <div className="flex items-center justify-between pb-4 border-b border-stone/60">
        <h3 className="font-editorial text-sm font-bold uppercase tracking-wider text-ink">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ sort: "featured" })}
            className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary hover:underline font-bold"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Category Section */}
      <div>
        <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-rose-600">Category</h4>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onChange({ ...query, category: undefined })}
            className={cn(
              "text-left text-xs transition-all py-1.5 px-3 rounded-lg flex items-center justify-between font-medium",
              !query.category
                ? "bg-rose-50 text-rose-600 font-bold border border-rose-200 shadow-2xs"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <span>All Categories</span>
            {!query.category && <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />}
          </button>
          {CATEGORIES.map((c) => {
            const isSelected = query.category === c || query.category?.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => onChange({ ...query, category: isSelected ? undefined : (c as any) })}
                className={cn(
                  "text-left text-xs transition-all py-1.5 px-3 rounded-lg flex items-center justify-between font-medium",
                  isSelected
                    ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-200"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <span>{c}</span>
                {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>


      {/* Size Filter */}
      <div>
        <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-primary">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const isSelected = query.sizes?.includes(s);
            return (
              <button
                key={s}
                onClick={() =>
                  onChange({
                    ...query,
                    sizes: isSelected ? undefined : [s],
                  })
                }
                className={cn(
                  "border px-3 py-1.5 text-xs font-mono transition-all duration-200 rounded",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-stone text-graphite hover:border-primary"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-primary">Price Range</h4>
        <div className="flex flex-col gap-2">
          {[
            { label: "Under ₹2,000", min: 0, max: 2000 },
            { label: "₹2,000 – ₹4,000", min: 2000, max: 4000 },
            { label: "Above ₹4,000", min: 4000, max: undefined },
          ].map((r) => {
            const isSelected = query.minPrice === r.min && query.maxPrice === r.max;
            return (
              <button
                key={r.label}
                onClick={() => onChange({ ...query, minPrice: r.min, maxPrice: r.max })}
                className={cn(
                  "text-left text-xs transition-colors py-1 flex items-center justify-between",
                  isSelected ? "text-primary font-bold" : "text-graphite hover:text-primary"
                )}
              >
                <span>{r.label}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Selector */}
      <div className="pt-2 border-t border-stone/50">
        <h4 className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-primary">Sort Collection</h4>
        <Select
          value={query.sort || "featured"}
          onChange={(e) => onChange({ ...query, sort: e.target.value as ProductQuery["sort"] })}
        >
          <option value="featured">Featured Atelier</option>
          <option value="newest">New Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </Select>
      </div>
    </div>

  );
}

