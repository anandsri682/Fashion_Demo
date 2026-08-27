"use client";

import { useEffect, useMemo, useState } from "react";
import { orderService } from "@/services/orderService";
import { Order, OrderStatus } from "@/types";
import { OrderTable } from "@/components/admin/OrderTable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageSearch } from "lucide-react";
import { ORDER_STATUS_FLOW } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");

  useEffect(() => {
    orderService.getOrders().then(setOrders);
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      if (search) {
        const q = search.toLowerCase();
        if (!o.id.toLowerCase().includes(q) && !o.customerName.toLowerCase().includes(q) && !o.customerPhone.includes(q)) {
          return false;
        }
      }
      if (status && o.status !== status) return false;
      return true;
    });
  }, [orders, search, status]);

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">Orders</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input placeholder="Search by order ID, customer, or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-full sm:w-56">
          <Select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | "")}>
            <option value="">All Statuses</option>
            {[...ORDER_STATUS_FLOW, "Cancelled" as const].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {orders === null && <DashboardSkeleton />}

      {orders !== null && filtered.length === 0 && (
        <EmptyState icon={PackageSearch} title="No orders found" description="Try adjusting your search or filters." />
      )}

      {orders !== null && filtered.length > 0 && <OrderTable orders={filtered} />}
    </div>
  );
}
