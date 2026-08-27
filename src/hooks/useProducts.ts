"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { AsyncStatus, PaginatedResult, Product, ProductQuery } from "@/types";

export function useProducts(query: ProductQuery) {
  const [data, setData] = useState<PaginatedResult<Product> | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    productService
      .getProducts(query)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setStatus(res.items.length === 0 ? "empty" : "success");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query)]);

  return { data, status };
}
