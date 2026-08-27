"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/services/orderService";
import { Order, ORDER_STATUS_FLOW, OrderStatus } from "@/types";
import { PageLoader } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatCurrency, formatDate } from "@/lib/format";
import Image from "next/image";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToastStore } from "@/store/toastStore";
import { OrderTimeline } from "@/components/order/OrderTimeline";

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

function toDateInputValue(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

import { Printer, Tag } from "lucide-react";
import { CustomerTaxInvoice } from "@/components/order/CustomerTaxInvoice";
import { AdminShippingLabel } from "@/components/order/AdminShippingLabel";

export default function AdminOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const push = useToastStore((s) => s.push);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [statusDraft, setStatusDraft] = useState<OrderStatus>("Pending");
  const [deliveryDraft, setDeliveryDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<"tax" | "label" | null>(null);

  useEffect(() => {
    orderService.getOrder(params.id).then((o) => {
      setOrder(o);
      if (o) {
        setStatusDraft(o.status);
        setDeliveryDraft(toDateInputValue(o.expectedDelivery));
      }
    });
  }, [params.id]);

  async function handleUpdate() {
    if (!order) return;
    setSaving(true);
    try {
      const updated = await orderService.updateOrderStatus(
        order.id,
        statusDraft,
        new Date(deliveryDraft).toISOString()
      );
      setOrder(updated);
      push("Order status updated");
    } catch {
      push("Could not update order", "error");
    } finally {
      setSaving(false);
    }
  }

  if (order === undefined) return <PageLoader />;
  if (order === null) return <ErrorState message="This order could not be found." />;

  return (
    <div>
      {activeModal === "tax" && <CustomerTaxInvoice order={order} onClose={() => setActiveModal(null)} />}
      {activeModal === "label" && <AdminShippingLabel order={order} onClose={() => setActiveModal(null)} />}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-ink">Order #{order.id}</h1>
          <p className="mt-1 text-xs text-ash font-mono">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveModal("label")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone bg-paper-pure px-3.5 py-2 text-xs font-bold text-ink hover:border-primary hover:text-primary transition-all shadow-xs"
          >
            <Tag className="h-4 w-4 text-primary" />
            <span>Print Shipping Label</span>
          </button>
          <button
            onClick={() => setActiveModal("tax")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-primary transition-all shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print Tax Invoice</span>
          </button>
          <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
        </div>
      </div>



      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="mb-2 text-[11px] uppercase font-bold tracking-widest text-slate-400">Customer Details</p>
              <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
              <p className="text-sm text-slate-600 font-mono mt-0.5">{order.customerEmail}</p>
              <p className="text-sm text-slate-600 font-mono mt-0.5">{order.customerPhone}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="mb-2 text-[11px] uppercase font-bold tracking-widest text-slate-400">Delivery Address</p>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.pincode}
              </p>
              <p className="mt-2 text-xs font-mono text-rose-600 font-bold">Expected: {formatDate(order.expectedDelivery)}</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 items-center">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-slate-100 rounded-xl border border-slate-200">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex flex-1 justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500 font-mono">
                      {item.size} · {item.color} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-xs space-y-2.5">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900 font-bold">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span className="font-mono">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-mono text-slate-900 font-bold">{order.shipping === 0 ? "FREE" : formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span className="font-mono text-slate-900 font-bold">{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
              <span>Total</span>
              <span className="font-mono text-rose-600">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Payment Method</span>
              <span className="font-mono text-slate-900 font-bold uppercase">{order.paymentMethod.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Payment Status</span>
              <span className="font-mono text-emerald-600 font-bold uppercase">{order.status === "Cancelled" ? "Refunded" : "Paid"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="mb-4 text-sm font-bold text-slate-900 uppercase tracking-wider">Update Status</h3>
            <Select label="Order Status" value={statusDraft} onChange={(e) => setStatusDraft(e.target.value as OrderStatus)}>
              {[...ORDER_STATUS_FLOW, "Cancelled" as const].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <div className="mt-4">
              <Input
                label="Expected Delivery Date"
                type="date"
                value={deliveryDraft}
                onChange={(e) => setDeliveryDraft(e.target.value)}
              />
            </div>
            <Button className="mt-5 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl py-3" loading={saving} onClick={handleUpdate}>
              Save Changes
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="mb-6 text-sm font-bold text-slate-900 uppercase tracking-wider">Timeline</h3>
            <OrderTimeline status={order.status} />
          </div>
        </div>
      </div>

    </div>
  );
}
