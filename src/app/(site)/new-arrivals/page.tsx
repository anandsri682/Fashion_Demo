import { Suspense } from "react";
import { ProductListing } from "@/components/product/ProductListing";

export default function NewArrivalsPage() {
  return (
    <Suspense>
      <ProductListing title="New Arrivals" collection="new-arrivals" />
    </Suspense>
  );
}
