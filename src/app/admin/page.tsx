"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { OrderTable } from "@/components/admin/OrderTable";
import { formatCurrency } from "@/lib/format";
import { getImageUrl } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";
import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  TrendingUp,
  XCircle,
  Edit3,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("ALL");
  const [statsData, setStatsData] = useState<any>(null);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(10);
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    adminService.getDashboard(period).then(setStatsData);
  }, [period]);

  if (!statsData) return <DashboardSkeleton />;

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalUsers = 0,
    pendingOrders = 0,
    processingOrders = 0,
    shippedOrders = 0,
    deliveredOrders = 0,
    cancelledOrders = 0,
  } = statsData || {};

  const lowStockList = (statsData?.lowStockProductsList || []).filter(Boolean);
  const outOfStockList = (statsData?.outOfStockProductsList || []).filter(Boolean);
  const bestSellers = (statsData?.bestSellingProductsList || []).filter((b: any) => b && b.product);
  const recentCustomers = (statsData?.recentUsers || []).filter(Boolean);
  const recentOrders = (statsData?.recentOrders || []).filter(Boolean);


  async function handleUpdateStock(productId: string) {
    try {
      await adminService.updateProductStock(productId, newStockValue);
      push("Stock updated successfully");
      setEditingStockId(null);
      const reloaded = await adminService.getDashboard(period);
      setStatsData(reloaded);
    } catch {
      push("Failed to update product stock");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header & Period Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone/50 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">COMMERCIAL ANALYTICS</span>
          <h1 className="font-editorial text-3xl font-bold text-ink">Maison Noir Business Dashboard</h1>
        </div>

        <div className="flex items-center gap-1.5 bg-paper-pure p-1 rounded-lg border border-stone/60 shadow-xs">
          {[
            { label: "Today", value: "TODAY" },
            { label: "7 Days", value: "7_DAYS" },
            { label: "30 Days", value: "30_DAYS" },
            { label: "This Year", value: "THIS_YEAR" },
            { label: "All Time", value: "ALL" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                period === p.value ? "bg-primary text-white shadow-xs" : "text-graphite hover:text-primary"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={IndianRupee} />
        <DashboardCard label="Total Orders" value={String(totalOrders)} icon={ShoppingCart} />
        <DashboardCard label="Total Products" value={String(totalProducts)} icon={Package} />
        <DashboardCard label="Total Customers" value={String(totalUsers)} icon={Users} />
        <DashboardCard label="Pending Orders" value={String(pendingOrders)} icon={Clock} />
        <DashboardCard label="Processing Orders" value={String(processingOrders)} icon={Package} />
        <DashboardCard label="Delivered Orders" value={String(deliveredOrders)} icon={CheckCircle2} />
        <DashboardCard label="Cancelled Orders" value={String(cancelledOrders)} icon={XCircle} tone={cancelledOrders > 0 ? "warning" : "default"} />
      </div>

      {/* Out of Stock & Low Stock Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Out of Stock Card */}
        <div className="rounded-xl border border-error/30 bg-error/5 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-error/20">
            <div className="flex items-center gap-2 text-error font-bold text-sm">
              <XCircle className="h-5 w-5" />
              <span>OUT OF STOCK ({outOfStockList.length})</span>
            </div>
            <Link href="/admin/inventory" className="text-xs font-bold text-error underline">Manage Inventory</Link>
          </div>
          {outOfStockList.length === 0 ? (
            <p className="mt-4 text-xs font-mono text-ash">No items out of stock.</p>
          ) : (
            <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-1">
              {outOfStockList.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-stone/40">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-8 overflow-hidden rounded bg-stone shrink-0">
                      <Image src={getImageUrl(p.image)} alt={p.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{p.title}</p>
                      <p className="text-[10px] text-ash">{p.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingStockId(p.id); setNewStockValue(10); }}
                    className="flex items-center gap-1 rounded bg-error/10 px-2.5 py-1 text-xs font-bold text-error hover:bg-error hover:text-white transition-all"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Restock</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Card */}
        <div className="rounded-xl border border-brass/40 bg-brass/5 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-brass/20">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <AlertTriangle className="h-5 w-5" />
              <span>LOW STOCK ({lowStockList.length})</span>
            </div>
            <Link href="/admin/inventory" className="text-xs font-bold text-primary underline">Manage Inventory</Link>
          </div>
          {lowStockList.length === 0 ? (
            <p className="mt-4 text-xs font-mono text-ash">No low-stock items.</p>
          ) : (
            <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-1">
              {lowStockList.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-stone/40">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-8 overflow-hidden rounded bg-stone shrink-0">
                      <Image src={getImageUrl(p.image)} alt={p.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{p.title}</p>
                      <p className="text-[10px] text-primary font-bold">Only {p.stock} remaining</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingStockId(p.id); setNewStockValue(p.stock + 10); }}
                    className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>+ Add Stock</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Best Selling Products & Customers Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Best Selling Products */}
        <div className="rounded-xl border border-stone/60 bg-paper-pure p-6 shadow-subtle lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-editorial text-lg font-bold text-ink flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Best-Selling Products</span>
            </h3>
            <span className="text-[10px] font-mono text-ash uppercase">Calculated from Real MongoDB Orders</span>
          </div>

          {bestSellers.length === 0 ? (
            <div className="py-12 text-center text-xs text-ash font-mono">No sales data recorded yet for this period.</div>
          ) : (
            <div className="divide-y divide-stone/50">
              {bestSellers.map((item: any) => {
                const prod = item?.product || {};
                const prodId = prod.id || prod._id || Math.random().toString();
                const prodTitle = prod.title || "Product";
                const prodPrice = prod.price || 0;
                const prodStock = prod.stock ?? prod.quantity ?? 0;
                const imgUrl = getImageUrl(prod.images?.[0]?.url || "");
                return (
                  <div key={prodId} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-10 overflow-hidden rounded bg-stone shrink-0">
                        <Image src={imgUrl} alt={prodTitle} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink">{prodTitle}</p>
                        <p className="text-[10px] text-ash font-mono">{formatCurrency(prodPrice)} &middot; Stock: {prodStock}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">{item.unitsSold || 0} units sold</p>
                      <p className="text-[10px] text-ash font-mono">{formatCurrency(item.totalRevenue || 0)} revenue</p>
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* Recent Customers */}
        <div className="rounded-xl border border-stone/60 bg-paper-pure p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-editorial text-lg font-bold text-ink">Recent Customers</h3>
            <Link href="/admin/customers" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-stone/50">
            {recentCustomers.slice(0, 6).map((u: any) => (
              <div key={u.id} className="py-3">
                <p className="text-xs font-bold text-ink">{u.firstName} {u.lastName}</p>
                <p className="text-[11px] text-ash font-mono">{u.email}</p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-primary font-bold">
                  <span>{u.orderCount} Orders</span>
                  <span>{formatCurrency(u.totalSpent || 0)} Total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-xl border border-stone/60 bg-paper-pure p-6 shadow-subtle">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-editorial text-lg font-bold text-ink">Recent Storefront Orders</h3>
          <Link href="/admin/orders" className="text-xs font-bold text-primary uppercase tracking-wider hover:underline">
            View All Orders
          </Link>
        </div>
        <OrderTable orders={recentOrders} />
      </div>

      {/* Quick Stock Edit Modal */}
      {editingStockId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-editorial text-lg font-bold text-ink">Quick Stock Update</h3>
            <p className="text-xs text-ash">Enter the new available stock quantity for this product in MongoDB:</p>
            <input
              type="number"
              min="0"
              value={newStockValue}
              onChange={(e) => setNewStockValue(Number(e.target.value))}
              className="w-full rounded-lg border border-stone p-2.5 text-sm font-mono focus:border-primary focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingStockId(null)}
                className="px-4 py-2 text-xs font-bold text-ash hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStock(editingStockId)}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-crimson"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

