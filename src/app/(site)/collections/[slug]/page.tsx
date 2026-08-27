import { Suspense } from "react";
import { ProductListing } from "@/components/product/ProductListing";

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const title = params.slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
  return (
    <Suspense>
      <ProductListing title={title} collection={params.slug} />
    </Suspense>
  );
}
