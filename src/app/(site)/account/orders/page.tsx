"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { orderService } from "@/services/orderService";
import { AsyncStatus, Order } from "@/types";
import { OrderCard } from "@/components/order/OrderCard";
import { OrderSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { PackageOpen } from "lucide-react";

export default function MyOrdersPage() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<AsyncStatus>("loading");

  useEffect(() => {
    if (!user) return;
    setStatus("loading");
    orderService
      .getOrders(user.id)
      .then((res) => {
        setOrders(res);
        setStatus(res.length === 0 ? "empty" : "success");
      })
      .catch(() => setStatus("error"));
  }, [user]);

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl text-ink">My Orders</h2>
      {status === "loading" && (
        <div className="flex flex-col gap-4">
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      )}
      {status === "error" && <ErrorState message="We couldn't load your orders right now." />}
      {status === "empty" && (
        <EmptyState
          icon={PackageOpen}
          title="No orders yet"
          description="Your placed orders will show up here."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      )}
      {status === "success" && (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
