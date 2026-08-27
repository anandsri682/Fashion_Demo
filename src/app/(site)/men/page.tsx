import { Suspense } from "react";
import { ProductListing } from "@/components/product/ProductListing";

export default function MenPage() {
  return (
    <Suspense>
      <ProductListing title="Men" gender="Men" />
    </Suspense>
  );
}
