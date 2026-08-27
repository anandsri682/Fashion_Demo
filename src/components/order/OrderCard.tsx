import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { getImageUrl } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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

export function OrderCard({ order }: { order: Order }) {
  return (
    <div className="border border-stone/50 bg-paper p-6 transition-all hover:border-brass hover:shadow-xs">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-stone/40 pb-3">
        <div>
          <p className="text-[10px] uppercase tracking-luxury font-semibold text-brass">Order #{order.id}</p>
          <p className="text-xs text-ash font-mono">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {order.items.map((item, i) => (
          <div key={i} className="relative h-20 w-16 shrink-0 overflow-hidden bg-stone border border-stone/40">
            <Image src={getImageUrl(item.image)} alt={item.title} fill className="object-cover" sizes="64px" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone/40 pt-4">
        <div className="text-xs text-ash font-body">
          <p className="font-semibold text-ink">{order.paymentMethod.replace("_", " ")}</p>
          <p className="font-mono text-[11px]">Est. delivery: {formatDate(order.expectedDelivery)}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-semibold text-ink">{formatCurrency(order.total)}</span>
          <Link href={`/account/orders/${order.id}`}>
            <Button variant="gold" size="sm">
              View Order Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

