"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";
import { useWishlistStore } from "@/store/wishlistStore";
import { Package, Clock, CheckCircle2, Heart, MapPin, Settings, LogOut, Crown, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function AccountOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  useEffect(() => {
    if (!user) return;
    orderService.getOrders(user.id).then(setOrders);
  }, [user]);

  if (!user) return null;

  const stats = [
    { label: "Total Orders", value: orders?.length ?? "—", icon: Package },
    { label: "Active Orders", value: orders?.filter((o) => ["Pending", "Confirmed", "Processing"].includes(o.status)).length ?? "—", icon: Clock },
    { label: "Delivered Orders", value: orders?.filter((o) => o.status === "Delivered").length ?? "—", icon: CheckCircle2 },
    { label: "Wishlist Items", value: wishlistCount, icon: Heart },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="border border-brass/30 bg-stone-light/40 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-brass" />
            <p className="text-[10px] uppercase tracking-luxury font-semibold text-brass">Private Client</p>
          </div>
          <h2 className="mt-1 font-editorial text-3xl font-light text-ink">
            {user.firstName} {user.lastName}
          </h2>
          <p className="mt-1 text-xs font-mono text-ash">{user.email}</p>
        </div>
        <div className="border-t sm:border-t-0 sm:border-l border-stone/50 pt-3 sm:pt-0 sm:pl-6 text-xs text-graphite">
          <p className="text-[10px] uppercase tracking-luxury text-ash font-semibold">Tier Status</p>
          <p className="font-editorial text-lg font-medium text-brass">Privilège Member</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-luxury text-ink border-b border-stone/40 pb-2">
          Portfolio Overview
        </h3>
        {orders === null ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border border-stone/50 bg-paper p-5 transition-all hover:border-brass hover:shadow-xs">
                <s.icon className="h-5 w-5 text-brass" strokeWidth={1.5} />
                <p className="mt-3 font-editorial text-3xl text-ink font-light">{s.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-luxury font-semibold text-ash">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-luxury text-ink border-b border-stone/40 pb-2">
          Quick Access
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="group flex items-center justify-between border border-stone/50 bg-paper p-5 hover:border-brass transition-all hover-underline-gold"
          >
            <div className="flex items-center gap-3.5">
              <Package className="h-5 w-5 text-brass" />
              <div>
                <span className="text-sm font-medium text-ink block">Order History</span>
                <span className="text-[10px] text-ash tracking-wide">Track shipments & past acquisitions</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ash group-hover:text-brass transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/account/addresses"
            className="group flex items-center justify-between border border-stone/50 bg-paper p-5 hover:border-brass transition-all hover-underline-gold"
          >
            <div className="flex items-center gap-3.5">
              <MapPin className="h-5 w-5 text-brass" />
              <div>
                <span className="text-sm font-medium text-ink block">Address Directory</span>
                <span className="text-[10px] text-ash tracking-wide">Manage delivery locations</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ash group-hover:text-brass transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/wishlist"
            className="group flex items-center justify-between border border-stone/50 bg-paper p-5 hover:border-brass transition-all hover-underline-gold"
          >
            <div className="flex items-center gap-3.5">
              <Heart className="h-5 w-5 text-brass" />
              <div>
                <span className="text-sm font-medium text-ink block">Curated Wishlist</span>
                <span className="text-[10px] text-ash tracking-wide">{wishlistCount} saved creations</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ash group-hover:text-brass transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/account/settings"
            className="group flex items-center justify-between border border-stone/50 bg-paper p-5 hover:border-brass transition-all hover-underline-gold"
          >
            <div className="flex items-center gap-3.5">
              <Settings className="h-5 w-5 text-brass" />
              <div>
                <span className="text-sm font-medium text-ink block">Account Preferences</span>
                <span className="text-[10px] text-ash tracking-wide">Security & personal info</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ash group-hover:text-brass transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="pt-4 border-t border-stone/40">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs uppercase tracking-luxury font-semibold text-ash hover:text-error transition-colors"
        >
          <LogOut className="h-4 w-4" /> Terminate Session (Logout)
        </button>
      </div>
    </div>
  );
}

