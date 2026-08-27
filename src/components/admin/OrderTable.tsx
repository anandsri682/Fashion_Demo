import { Order } from "@/types";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<Order["status"], "default" | "brass" | "error" | "outline"> = {
  Pending: "outline",
  Confirmed: "brass",
  Processing: "brass",
  Packed: "brass",
  Shipped: "brass",
  "Out for Delivery": "brass",
  Delivered: "default",
  Cancelled: "error",
};

export function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <>
      {/* Mobile Admin Order Cards Layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">ORDER ID</span>
                <Link href={`/admin/orders/${o.id}`} className="text-xs font-bold text-rose-600 hover:underline">
                  #{o.id.substring(0, 8)}...
                </Link>
              </div>
              <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-100 py-2.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Customer</span>
                <span className="font-bold text-slate-900 truncate block">{o.customerName}</span>
                <span className="text-[11px] font-mono text-slate-500">{o.customerPhone}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-medium block">Total &amp; Payment</span>
                <span className="font-extrabold text-slate-900 block">{formatCurrency(o.total)}</span>
                <span className="text-[11px] font-mono text-emerald-600 font-bold uppercase">{o.paymentMethod.replace("_", " ")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-400">Date: {formatDate(o.createdAt)}</span>
              <Link href={`/admin/orders/${o.id}`} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-rose-600 transition-colors">
                View Order
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Admin Table Layout */}
      <div className="hidden md:block overflow-x-auto border border-stone rounded-xl bg-white shadow-xs">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-stone bg-stone/40 text-xs uppercase tracking-wide text-graphite">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Expected Delivery</th>
              <th className="px-4 py-3">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-stone last:border-0 hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-rose-600 font-mono font-bold hover:underline">
                    {o.id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink font-semibold">{o.customerName}</td>
                <td className="px-4 py-3 text-ash font-mono">{o.customerPhone}</td>
                <td className="px-4 py-3 text-ink font-bold">{formatCurrency(o.total)}</td>
                <td className="px-4 py-3 text-ash font-mono">{o.paymentMethod.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                </td>
                <td className="px-4 py-3 text-ash font-mono">{formatDate(o.expectedDelivery)}</td>
                <td className="px-4 py-3 text-ash font-mono">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

