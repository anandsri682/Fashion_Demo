"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { adminService } from "@/services/adminService";
import { Product } from "@/types";
import { getImageUrl } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { useToastStore } from "@/store/toastStore";
import { Boxes, Search, Edit3, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "LOW_STOCK" | "OUT_OF_STOCK">("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      const res = await productService.getProducts({ pageSize: 100 });
      setProducts(res.items);
    } catch {
      push("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  async function handleStockUpdate(id: string) {
    if (stockValue < 0) {
      push("Stock cannot be negative");
      return;
    }
    try {
      await adminService.updateProductStock(id, stockValue);
      push("Inventory stock updated in MongoDB!");
      setEditingId(null);
      await loadInventory();
    } catch {
      push("Failed to update stock");
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "LOW_STOCK") return p.quantity > 0 && p.quantity <= 10;
    if (filter === "OUT_OF_STOCK") return p.quantity === 0;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/50 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">WAREHOUSE &amp; STOCK</span>
          <h1 className="font-editorial text-3xl font-bold text-ink">Inventory Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              filter === "ALL" ? "bg-ink text-white border-ink" : "bg-paper text-graphite border-stone hover:border-ink"
            }`}
          >
            All Inventory ({products.length})
          </button>
          <button
            onClick={() => setFilter("LOW_STOCK")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              filter === "LOW_STOCK" ? "bg-primary text-white border-primary" : "bg-paper text-graphite border-stone hover:border-primary"
            }`}
          >
            Low Stock ({products.filter((p) => p.quantity > 0 && p.quantity <= 10).length})
          </button>
          <button
            onClick={() => setFilter("OUT_OF_STOCK")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              filter === "OUT_OF_STOCK" ? "bg-error text-white border-error" : "bg-paper text-graphite border-stone hover:border-error"
            }`}
          >
            Out of Stock ({products.filter((p) => p.quantity === 0).length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ash" />
        <input
          type="text"
          placeholder="Search products by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-stone/70 bg-paper-pure px-4 pl-10 py-2.5 text-xs font-mono text-ink placeholder:text-ash focus:border-primary focus:outline-none shadow-xs"
        />
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-stone/60 bg-paper-pure shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-ash font-mono animate-pulse">Loading stock records from MongoDB...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-ash font-mono">No inventory records found for this selection.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-stone/30 text-graphite font-mono font-bold uppercase border-b border-stone/50">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/50">
              {filteredProducts.map((p) => {
                const isOut = p.quantity === 0;
                const isLow = p.quantity > 0 && p.quantity <= 10;
                return (
                  <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 overflow-hidden rounded bg-stone shrink-0 border border-stone/40">
                          <Image src={getImageUrl(p.images[0]?.url || "")} alt={p.title} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-ink text-xs">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-ash font-mono">{p.category}</td>
                    <td className="p-4 font-bold text-ink font-mono">{formatCurrency(p.price)}</td>
                    <td className="p-4">
                      <span className={`font-bold font-mono text-sm ${isOut ? "text-error" : isLow ? "text-primary" : "text-ink"}`}>
                        {p.quantity} units
                      </span>
                    </td>
                    <td className="p-4">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 px-2.5 py-1 text-[10px] font-bold text-error">
                          <XCircle className="h-3 w-3" /> Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                          <AlertTriangle className="h-3 w-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => { setEditingId(p.id); setStockValue(p.quantity); }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Update Stock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Stock Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-editorial text-lg font-bold text-ink">Update Product Inventory</h3>
            <p className="text-xs text-ash font-mono">Specify exact stock units available in MongoDB:</p>
            <input
              type="number"
              min="0"
              value={stockValue}
              onChange={(e) => setStockValue(Number(e.target.value))}
              className="w-full rounded-lg border border-stone p-2.5 text-sm font-mono focus:border-primary focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingId(null)} className="px-4 py-2 text-xs font-bold text-ash hover:text-ink">
                Cancel
              </button>
              <button
                onClick={() => handleStockUpdate(editingId)}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-crimson"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
