"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";
import { useWishlistStore } from "@/store/wishlistStore";
import {
  Package,
  Heart,
  Ticket,
  Headphones,
  ChevronRight,
  User,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  Zap,
  Smartphone,
  Globe,
  FileText,
  HelpCircle,
  MessageSquare,
  Building2,
  Mail,
  ArrowRight,
} from "lucide-react";
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

  const userEmail = user.email || "anandsri682@gmail.com";

  return (
    <div className="space-y-4 pb-20 bg-slate-50 min-h-screen p-2 sm:p-4">
      {/* 1. Top Card: Membership Banner */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 shadow-xs relative">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 truncate max-w-[220px]">
            {userEmail}
          </h2>
          <div className="flex items-center gap-1 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200 text-amber-900 font-bold text-xs">
            <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>0</span>
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-600 font-normal leading-relaxed max-w-xs">
          Enjoy FREE Maison Noir Privé, Early Access to sale and more with Black.
        </p>

        <button className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm">
          <span>Explore</span>
          <span className="font-extrabold text-amber-400 tracking-wider">BLACK</span>
        </button>
      </div>

      {/* 2. 4 Quick Action Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/account/orders"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 transition-all group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Orders</span>
            <span className="text-[10px] text-slate-500 font-mono">{orders?.length ?? 0} Items</span>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 transition-all group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Wishlist</span>
            <span className="text-[10px] text-slate-500 font-mono">{wishlistCount} Items</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 transition-all cursor-pointer group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Coupons</span>
            <span className="text-[10px] text-slate-500 font-mono">2 Available</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 transition-all cursor-pointer group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Help Center</span>
            <span className="text-[10px] text-slate-500 font-mono">24x7 Support</span>
          </div>
        </div>
      </div>

      {/* 3. Add/Verify Email Banner */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900">Add/Verify your Email</span>
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping" />
            </div>
            <span className="text-[11px] text-slate-500 block">Get latest updates of your orders</span>
          </div>
        </div>
        <button className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs">
          Update
        </button>
      </div>

      {/* 4. Account Settings List */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs divide-y divide-slate-100">

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Smartphone className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-800">Manage Devices</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>

        <Link href="/account/settings" className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-800">Edit Profile</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-800">Saved Credit / Debit &amp; Gift Cards</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>

        <Link href="/account/addresses" className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-800">Saved Addresses</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-800">Select Language</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-800">Notification Settings</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-800">Privacy Center</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* 6. My Activity Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">My Activity</h3>
        <div className="space-y-2 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-800">Reviews</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between pt-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-800">Questions &amp; Answers</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 7. Feedback & Information Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Feedback &amp; Information</h3>
        <div className="space-y-2 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-800">Terms, Policies and Licenses</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between pt-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-800">Browse FAQs</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full rounded-xl border border-rose-200 bg-rose-50 py-3 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 shadow-2xs"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  );
}



