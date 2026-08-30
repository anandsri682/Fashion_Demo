"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, History, ArrowRight, ArrowLeft } from "lucide-react";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import { getImageUrl } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import Image from "next/image";

const POPULAR_SEARCHES = [
  "Shirts",
  "T-Shirts",
  "Jeans",
  "Dresses",
  "Pants",
  "Jackets",
  "Kurtas",
  "Accessories",
  "New Arrivals",
  "Sale",
];


interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("maison_recent_searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts({ search: query.trim(), pageSize: 6 });
        setResults(data.items);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  function handleSearchSubmit(searchVal: string) {
    if (!searchVal.trim()) return;
    const clean = searchVal.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("maison_recent_searches", JSON.stringify(updated));
    }
    onClose();
    router.push(`/products?search=${encodeURIComponent(clean)}`);
  }

  function clearRecent() {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("maison_recent_searches");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink/90 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      {/* Search Header */}
      <div className="border-b border-stone/20 bg-paper-pure px-4 py-4 sm:px-8">
        <div className="container-x flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 text-ink hover:text-rose-600 transition-colors rounded-full hover:bg-slate-100"
            aria-label="Back to store"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <Search className="h-5 w-5 text-primary shrink-0" />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit(query);
            }}
            className="flex-1"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, categories, styles..."
              className="w-full bg-transparent text-base sm:text-lg font-body text-ink placeholder:text-ash outline-none"
            />
          </form>

          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs uppercase tracking-luxury text-ash hover:text-primary font-semibold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-light/60 text-ink hover:bg-primary hover:text-white transition-all"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="container-x flex-1 overflow-y-auto px-4 py-8 text-paper-pure">
        {query.trim() === "" ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-primary font-semibold">
                  <span className="flex items-center gap-2">
                    <History className="h-4 w-4" /> Recent Searches
                  </span>
                  <button onClick={clearRecent} className="text-ash hover:text-white transition-colors text-[10px]">
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSearchSubmit(item)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono hover:border-primary hover:bg-primary/20 transition-all"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
                <TrendingUp className="h-4 w-4" /> Popular Trends
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSearchSubmit(item)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono hover:border-primary hover:bg-primary/20 transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <p className="text-xs uppercase tracking-widest text-ash font-mono">
                {loading ? "Searching..." : `Found ${results.length} result(s) for "${query}"`}
              </p>
              {results.length > 0 && (
                <button
                  onClick={() => handleSearchSubmit(query)}
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                >
                  View All Products <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-40 bg-white/10 rounded" />
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onClose();
                      router.push(`/products/${product.id}`);
                    }}
                    className="group cursor-pointer rounded bg-white/5 p-2.5 transition-all hover:bg-white/10 hover:border-primary/40 border border-transparent"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/10 rounded mb-2">
                      <Image
                        src={getImageUrl(product.images[0]?.url || "")}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="160px"
                      />
                    </div>
                    <h4 className="line-clamp-1 text-xs font-semibold text-white group-hover:text-primary transition-colors">
                      {product.title}
                    </h4>
                    <p className="text-[11px] font-mono text-primary font-bold mt-0.5">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-ash font-body">No products matched your search keyword.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
