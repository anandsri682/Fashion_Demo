import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { PackageSearch } from "lucide-react";

export function ProductGrid({
  products,
  status,
}: {
  products: Product[];
  status: "idle" | "loading" | "success" | "error" | "empty";
}) {
  if (status === "loading") return <ProductGridSkeleton />;
  if (status === "error") return <ErrorState message="We couldn't load these products right now." />;
  if (status === "empty" || products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description="Try adjusting your filters or search for something else."
        actionLabel="Clear filters"
        actionHref="/products"
      />
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
