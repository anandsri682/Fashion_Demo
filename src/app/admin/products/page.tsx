"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CATEGORIES } from "@/data/mockData";
import { Plus } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageSearch } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const push = useToastStore((s) => s.push);

  function load() {
    setProducts(null);
    productService.getAllForAdmin().then(setProducts);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && p.category !== category) return false;
      if (statusFilter === "active" && !p.isActive) return false;
      if (statusFilter === "inactive" && p.isActive) return false;
      if (statusFilter === "low-stock" && p.quantity >= 15) return false;
      return true;
    });
  }, [products, search, category, statusFilter]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await productService.deleteProduct(id);
      push("Product deleted");
      load();
    } catch {
      push("Could not delete product", "error");
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-full sm:w-48">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="low-stock">Low Stock</option>
          </Select>
        </div>
      </div>

      {products === null && <DashboardSkeleton />}

      {products !== null && filtered.length === 0 && (
        <EmptyState icon={PackageSearch} title="No products found" description="Try adjusting your search or filters." />
      )}

      {products !== null && filtered.length > 0 && <ProductTable products={filtered} onDelete={handleDelete} />}
    </div>
  );
}
