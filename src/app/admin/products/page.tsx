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

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const push = useToastStore((s) => s.push);

  const PAGE_SIZE = 10;

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      setProducts((prev) => (prev ? prev.filter((p) => p.id !== id) : []));
      await productService.deleteProduct(id);
      push("Product deleted successfully");
    } catch {
      push("Could not delete product", "error");
      load();
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-500">INVENTORY MANAGEMENT</span>
          <h1 className="font-display text-3xl text-slate-900 font-bold">Products ({filtered.length})</h1>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input placeholder="Search products by title..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        <div className="w-full sm:w-48">
          <Select value={category} onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
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

      {products !== null && filtered.length > 0 && (
        <>
          <ProductTable products={paginatedProducts} onDelete={handleDelete} />

          {/* 10 Products Page-to-Page Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-500 font-mono">
              Showing <span className="font-bold text-slate-900">{(currentPage - 1) * PAGE_SIZE + 1}</span> -{" "}
              <span className="font-bold text-slate-900">{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> of{" "}
              <span className="font-bold text-slate-900">{filtered.length}</span> products
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              <span className="text-xs font-bold font-mono text-slate-900 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

