"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";
import { useWishlistStore } from "@/store/wishlistStore";
import { Package, Heart, Ticket, HelpCircle, ChevronRight, User, MapPin, CreditCard, Bell, Shield, LogOut, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-xl uppercase shadow-md">
          {user.firstName ? user.firstName[0] : "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 truncate">
              {user.firstName} {user.lastName}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200">
              <Crown className="h-3 w-3" /> Gold VIP
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{user.email}</p>
        </div>
      </div>

      {/* 4 Shortcut Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link href="/account/orders" className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-rose-300 transition-all text-center group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-2 group-hover:scale-110 transition-transform">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-900">ORDERS</span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5">{orders?.length ?? 0} Placed</span>
        </Link>

        <Link href="/wishlist" className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-rose-300 transition-all text-center group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-2 group-hover:scale-110 transition-transform">
            <Heart className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-900">WISHLIST</span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5">{wishlistCount} Saved</span>
        </Link>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-xs text-center cursor-pointer hover:border-rose-300 transition-all group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-2 group-hover:scale-110 transition-transform">
            <Ticket className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-900">COUPONS</span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5">2 Available</span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-xs text-center cursor-pointer hover:border-rose-300 transition-all group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-2 group-hover:scale-110 transition-transform">
            <HelpCircle className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-900">HELP CENTER</span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5">24x7 Support</span>
        </div>
      </div>

      {/* Account Settings List */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Account Settings
        </div>
        <div className="divide-y divide-slate-100">
          <Link href="/account/settings" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-900">Edit Profile</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link href="/account/addresses" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-900">Saved Addresses</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>

          <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-900">Saved Cards & UPI</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-900">Notification Settings</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-900">Privacy & Security</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        className="w-full rounded-2xl border border-rose-200 bg-rose-50/50 py-3.5 text-xs font-bold text-rose-600 hover:bg-rose-100/50 transition-colors flex items-center justify-center gap-2 shadow-xs"
      >
        <LogOut className="h-4 w-4" /> Logout from Account
      </button>
    </div>
  );
}


