import { Suspense } from "react";
import { ProductListing } from "@/components/product/ProductListing";

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductListing title="All Products" />
    </Suspense>
  );
}
