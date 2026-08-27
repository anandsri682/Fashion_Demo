"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";
import { PageLoader } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { formatCurrency, formatDate } from "@/lib/format";
import { getImageUrl } from "@/lib/api";
import Image from "next/image";
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

import { Printer, Download } from "lucide-react";

import { CustomerTaxInvoice } from "@/components/order/CustomerTaxInvoice";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    orderService.getOrder(params.id).then(setOrder);
  }, [params.id]);

  if (order === undefined) return <PageLoader />;
  if (order === null) return <ErrorState message="This order could not be found." />;

  return (
    <div className="space-y-8">
      {showInvoice && <CustomerTaxInvoice order={order} onClose={() => setShowInvoice(false)} />}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone/50 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-luxury font-semibold text-brass">Order Acquisition #{order.id}</p>
          <p className="text-xs text-ash font-mono mt-0.5">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInvoice(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone/70 bg-paper-pure px-3.5 py-1.5 text-xs font-mono font-bold text-ink hover:border-primary hover:text-primary transition-all shadow-xs"
          >
            <Printer className="h-4 w-4 text-primary" />
            <span>Tax Invoice</span>
          </button>
          <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
        </div>
      </div>



      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Purchased Items List */}
          <div className="divide-y divide-stone/40 border border-stone/40 bg-paper">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 items-center">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-stone border border-stone/40">
                  <Image src={getImageUrl(item.image)} alt={item.title} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex flex-1 justify-between items-center">
                  <div>
                    <h4 className="font-editorial text-base font-medium text-ink">{item.title}</h4>
                    <p className="mt-1 text-xs text-ash font-mono">
                      Size: {item.size} &middot; Color: {item.color} &middot; Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-ink">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping & Billing Addresses */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-stone/50 bg-stone-light/20 p-5 text-xs">
              <p className="mb-2 text-[10px] uppercase tracking-luxury text-brass font-semibold">Shipping Address</p>
              <p className="font-semibold text-ink">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-graphite font-body mt-1">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.pincode}
              </p>
              <p className="mt-1 font-mono text-ash">{order.shippingAddress.phone}</p>
            </div>
            <div className="border border-stone/50 bg-stone-light/20 p-5 text-xs">
              <p className="mb-2 text-[10px] uppercase tracking-luxury text-brass font-semibold">Billing Address</p>
              <p className="font-semibold text-ink">
                {order.billingAddress.firstName} {order.billingAddress.lastName}
              </p>
              <p className="text-graphite font-body mt-1">
                {order.billingAddress.addressLine1}, {order.billingAddress.city}, {order.billingAddress.state}{" "}
                {order.billingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Payment Method & Status */}
          <div className="border border-stone/50 bg-paper p-5 text-xs font-body space-y-2">
            <div className="flex justify-between text-graphite">
              <span className="uppercase tracking-luxury text-[10px] font-semibold text-ash">Payment Method</span>
              <span className="text-ink font-semibold">{order.paymentMethod.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between text-graphite pt-2 border-t border-stone/30">
              <span className="uppercase tracking-luxury text-[10px] font-semibold text-ash">Payment Status</span>
              <span className="text-brass font-semibold">{order.status === "Cancelled" ? "Refunded" : "Authorized & Paid"}</span>
            </div>
          </div>

          {/* Order Summary Cost Breakdown */}
          <div className="border border-stone/50 bg-paper p-5 text-xs font-mono space-y-2.5">
            <div className="flex justify-between text-graphite">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-brass font-semibold">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-graphite">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Complimentary" : formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-graphite">
              <span>Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-stone/50 pt-3 text-base text-ink font-semibold">
              <span className="font-editorial uppercase tracking-luxury text-sm">Total Acquisition Cost</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Tracking Timeline */}
        <div>
          <div className="border border-stone/50 bg-paper p-6 shadow-subtle sticky top-28">
            <h3 className="mb-6 font-editorial text-lg font-medium text-ink border-b border-stone/40 pb-2">
              Dispatch Timeline
            </h3>
            <OrderTimeline status={order.status} />
            <p className="mt-4 text-xs font-mono text-brass text-center border-t border-stone/40 pt-3">
              {order.status === "Delivered"
                ? `Delivered: ${formatDate(order.expectedDelivery)}`
                : order.status === "Cancelled"
                ? "Order Cancelled"
                : `Est. Delivery: ${formatDate(order.expectedDelivery)}`}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

