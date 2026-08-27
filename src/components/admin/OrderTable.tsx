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
    <div className="overflow-x-auto border border-stone">
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
            <tr key={o.id} className="border-b border-stone last:border-0">
              <td className="px-4 py-3">
                <Link href={`/admin/orders/${o.id}`} className="text-ink underline-offset-2 hover:underline">
                  {o.id}
                </Link>
              </td>
              <td className="px-4 py-3 text-ink">{o.customerName}</td>
              <td className="px-4 py-3 text-ash">{o.customerPhone}</td>
              <td className="px-4 py-3 text-ink">{formatCurrency(o.total)}</td>
              <td className="px-4 py-3 text-ash">{o.paymentMethod.replace("_", " ")}</td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
              </td>
              <td className="px-4 py-3 text-ash">{formatDate(o.expectedDelivery)}</td>
              <td className="px-4 py-3 text-ash">{formatDate(o.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
