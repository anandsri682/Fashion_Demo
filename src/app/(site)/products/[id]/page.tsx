"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import { PageLoader } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProductDetails } from "./ProductDetails";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    productService.getProduct(params.id).then(async (p) => {
      if (cancelled) return;
      setProduct(p);
      if (p) {
        const rel = await productService.getRelated(p);
        if (!cancelled) setRelated(rel);
      }
      if (p && typeof window !== "undefined") {
        const raw = window.localStorage.getItem("recently_viewed");
        const ids: string[] = raw ? JSON.parse(raw) : [];
        const next = [p.id, ...ids.filter((id) => id !== p.id)].slice(0, 8);
        window.localStorage.setItem("recently_viewed", JSON.stringify(next));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (product === undefined) return <PageLoader />;
  if (product === null) return <ErrorState message="This product could not be found." />;

  return <ProductDetails product={product} related={related} />;
}
