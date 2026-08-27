import { Suspense } from "react";
import { ProductListing } from "@/components/product/ProductListing";

export default function WomenPage() {
  return (
    <Suspense>
      <ProductListing title="Women" gender="Women" />
    </Suspense>
  );
}
