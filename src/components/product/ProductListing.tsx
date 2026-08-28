"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductQuery } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal, X, ArrowDown } from "lucide-react";

import { useRouter, usePathname } from "next/navigation";

export function ProductListing({
  title,
  gender,
  collection,
  fixedCategory,
}: {
  title: string;
  gender?: ProductQuery["gender"];
  collection?: string;
  fixedCategory?: ProductQuery["category"];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [extraQuery, setExtraQuery] = useState<ProductQuery>({});

  const urlCategory = (searchParams.get("category") as ProductQuery["category"]) || undefined;
  const activeCategory = extraQuery.category !== undefined ? extraQuery.category : (fixedCategory || urlCategory);


  const query: ProductQuery = useMemo(
    () => ({
      search: searchParams.get("search") || searchParams.get("q") || undefined,
      gender: gender || (searchParams.get("gender") as ProductQuery["gender"]) || undefined,
      collection: collection || searchParams.get("collection") || undefined,
      category: activeCategory,
      sort: (searchParams.get("sort") as ProductQuery["sort"]) || undefined,
      page,
      pageSize: 24,
      ...extraQuery,
    }),
    [gender, collection, fixedCategory, activeCategory, searchParams, page, extraQuery]
  );


  const handleFilterChange = (newQuery: ProductQuery) => {
    setExtraQuery(newQuery);
    setPage(1);

    // Update URL query parameters seamlessly
    const params = new URLSearchParams(searchParams.toString());
    if (newQuery.category) {
      params.set("category", newQuery.category);
    } else {
      params.delete("category");
    }

    if (newQuery.sort && newQuery.sort !== "featured") {
      params.set("sort", newQuery.sort);
    } else {
      params.delete("sort");
    }

    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };



  const { data, status } = useProducts(query);
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="container-x py-12 lg:py-16">
      {/* Page Header */}
      <div className="mb-12 border-b border-stone/50 pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-primary font-mono font-bold">MAISON NOIR CATALOG</span>
          <h1 className="mt-1 font-editorial text-4xl sm:text-5xl font-bold text-ink tracking-tight">{title}</h1>
          {data && (
            <p className="mt-2 text-xs font-mono tracking-wide text-ash">
              Showing <span className="text-primary font-bold">{data.items.length}</span> of{" "}
              <span className="text-primary font-bold">{data.total}</span> curated pieces
            </p>
          )}
        </div>

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center justify-center gap-2 border border-primary/40 bg-primary/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-white transition-all lg:hidden w-fit shadow-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filter &amp; Sort</span>
        </button>
      </div>

      <div className="flex gap-10 lg:gap-14">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28">
            <ProductFilters
              query={query}
              onChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          <ProductGrid products={data?.items || []} status={status} />

          {/* Load More Pagination */}
          {data && totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center gap-3 pt-8 border-t border-stone/40">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="gap-2 px-8 shadow-crimson rounded-full font-bold"
              >
                <span>Load More Creations</span>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <p className="text-[10px] text-ash tracking-wide font-mono">
                Page {page} of {totalPages}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-ink/60 backdrop-blur-xs lg:hidden">
          <div className="h-full w-full max-w-xs overflow-y-auto bg-paper p-6 shadow-2xl flex flex-col justify-between animate-slideLeft">
            <div>
              <div className="mb-6 flex items-center justify-between pb-4 border-b border-stone/50">
                <span className="font-editorial text-xl font-bold text-ink">Refine Selection</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="p-1 text-graphite hover:text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ProductFilters
                query={query}
                onChange={handleFilterChange}
              />
            </div>

            <div className="mt-8 pt-4 border-t border-stone/50">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center rounded-full shadow-crimson font-bold"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

