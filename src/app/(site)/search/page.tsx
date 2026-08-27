"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { productService } from "@/services/productService";
import { AsyncStatus, Product } from "@/types";
import { ProductGrid } from "@/components/product/ProductGrid";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<AsyncStatus>("loading");

  useEffect(() => {
    if (!q) {
      setStatus("empty");
      return;
    }
    setStatus("loading");
    productService
      .getProducts({ search: q, pageSize: 24 })
      .then((res) => {
        setProducts(res.items);
        setStatus(res.items.length === 0 ? "empty" : "success");
      })
      .catch(() => setStatus("error"));
  }, [q]);

  return (
    <div className="container-x py-12">
      <p className="text-xs uppercase tracking-widest2 text-ash">Search Results</p>
      <h1 className="mt-2 font-display text-4xl text-ink">&ldquo;{q}&rdquo;</h1>
      {status === "success" && <p className="mt-2 text-sm text-ash">{products.length} results found</p>}
      <div className="mt-10">
        <ProductGrid products={products} status={status} />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
