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
    <>
      {/* Mobile Admin Cards Layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-slate-100 rounded-xl border border-slate-100">
                {p.images[0]?.url ? (
                  <Image src={getImageUrl(p.images[0].url)} alt={p.title} fill className="object-cover" sizes="48px" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{p.category}</span>
                  <Badge variant={p.isActive ? "default" : "outline"}>{p.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{p.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-extrabold text-slate-900">{formatCurrency(p.price)}</span>
                  <span className="text-[11px] font-mono text-slate-500">Stock: {p.quantity}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5">
              <Link href={`/products/${p.id}`} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> View
              </Link>
              <Link href={`/admin/products/${p.id}/edit`} className="px-3 py-1.5 rounded-lg border border-slate-900 bg-slate-900 text-white text-xs font-bold hover:bg-rose-600 transition-colors flex items-center gap-1">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <button onClick={() => onDelete(p.id)} className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto border border-stone rounded-xl bg-white shadow-xs">
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
              <tr key={p.id} className="border-b border-stone last:border-0 hover:bg-slate-50/50">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-stone rounded-lg">
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
                  <span className="text-ink font-semibold">{p.title}</span>
                </td>
                <td className="px-4 py-3 text-ash">{p.category}</td>
                <td className="px-4 py-3 text-ink font-bold">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={p.quantity < 15 ? "text-error font-bold" : "text-ink"}>{p.quantity}</span>
                  {p.quantity < 15 && <span className="ml-2 text-[10px] uppercase text-error font-bold">Low</span>}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={p.isActive ? "default" : "outline"}>{p.isActive ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="px-4 py-3 text-ash font-mono">{formatDate(p.createdAt)}</td>
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
    </>
  );
}

