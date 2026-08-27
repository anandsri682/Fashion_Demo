"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";
import { PageLoader } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OrderSuccessPage() {
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    orderService.getOrder(params.orderId).then(setOrder);
  }, [params.orderId]);

  if (order === undefined) return <PageLoader />;
  if (order === null) return <ErrorState message="We couldn't find this order." />;

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brass" strokeWidth={1.25} />
        <h1 className="mt-6 font-display text-4xl text-ink">Order Placed Successfully</h1>
        <p className="mt-3 text-sm text-ash">Thank you — a confirmation has been sent to {order.customerEmail}.</p>

        <div className="mt-10 grid grid-cols-2 gap-6 border border-stone p-6 text-left sm:grid-cols-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ash">Order ID</p>
            <p className="mt-1 text-sm text-ink">{order.id}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ash">Order Date</p>
            <p className="mt-1 text-sm text-ink">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ash">Expected Delivery</p>
            <p className="mt-1 text-sm text-ink">{formatDate(order.expectedDelivery)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ash">Payment</p>
            <p className="mt-1 text-sm text-ink">{order.paymentMethod.replace("_", " ")}</p>
          </div>
        </div>

        <div className="mt-6 border border-stone p-6 text-left">
          <p className="mb-4 text-[11px] uppercase tracking-widest text-ash">Delivery Address</p>
          <p className="text-sm text-ink">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p className="text-sm text-ash">
            {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.pincode}
          </p>
        </div>

        <div className="mt-6 divide-y divide-stone border border-stone text-left">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-stone">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex flex-1 justify-between">
                <div>
                  <p className="text-sm text-ink">{item.title}</p>
                  <p className="text-xs text-ash">
                    {item.size} · {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <span className="text-sm text-ink">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
          <div className="flex justify-between p-4">
            <span className="text-sm font-medium text-ink">Total Amount</span>
            <span className="text-sm font-medium text-ink">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/account/orders/${order.id}`}>
            <Button size="lg" className="w-full sm:w-auto">
              View Order
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
