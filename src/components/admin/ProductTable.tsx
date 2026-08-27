"use client";

import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import { getImageUrl } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Pencil, Trash2, Eye } from "lucide-react";

export function ProductTable({
  products,
  onDelete,
}: {
  products: Product[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto border border-stone">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-stone bg-stone/40 text-xs uppercase tracking-wide text-graphite">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-stone last:border-0">
              <td className="flex items-center gap-3 px-4 py-3">
                <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-stone">
                  {p.images[0]?.url ? (
                          <Image
                            src={getImageUrl(p.images[0].url)}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : null}
                </div>
                <span className="text-ink">{p.title}</span>
              </td>
              <td className="px-4 py-3 text-ash">{p.category}</td>
              <td className="px-4 py-3 text-ink">{formatCurrency(p.price)}</td>
              <td className="px-4 py-3">
                <span className={p.quantity < 15 ? "text-error" : "text-ink"}>{p.quantity}</span>
                {p.quantity < 15 && <span className="ml-2 text-[10px] uppercase text-error">Low</span>}
              </td>
              <td className="px-4 py-3">
                <Badge variant={p.isActive ? "default" : "outline"}>{p.isActive ? "Active" : "Inactive"}</Badge>
              </td>
              <td className="px-4 py-3 text-ash">{formatDate(p.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3">
                  <Link href={`/products/${p.id}`} className="text-ash hover:text-ink" aria-label="View">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link href={`/admin/products/${p.id}/edit`} className="text-ash hover:text-ink" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button onClick={() => onDelete(p.id)} className="text-ash hover:text-error" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
