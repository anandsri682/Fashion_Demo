"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  FileText,
  HelpCircle,
  MessageSquare,
  ArrowUpRight,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AccountOverviewPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  useEffect(() => {
    if (!user) return;
    // Role-based navigation check: Admin users must be redirected to Admin Dashboard
    if (user.role === "ADMIN") {
      router.replace("/admin");
      return;
    }
    orderService.getOrders(user.id).then(setOrders);
  }, [user, router]);

  if (!user || user.role === "ADMIN") return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Maison Client";

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto px-1 sm:px-0">
      {/* 1. Compact Profile Header */}
      <div className="rounded-2xl border border-stone/50 bg-paper-pure p-4 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-white font-editorial font-bold text-base shadow-xs">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="font-editorial text-lg font-bold text-ink truncate">{fullName}</h1>
            <p className="text-xs text-ash font-mono truncate">{user.email}</p>
          </div>
        </div>
        <Link
          href="/account/settings"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0 ml-2"
        >
          <span>View Profile</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2. Quick Actions (2-Column Mobile Grid) */}
      <div>
        <h2 className="text-[11px] font-bold font-mono uppercase tracking-widest text-ash mb-2.5 px-1">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/account/orders"
            className="flex items-center gap-3 rounded-xl border border-stone/60 bg-paper-pure p-3.5 shadow-xs hover:border-primary transition-all group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone/40 text-ink group-hover:bg-primary group-hover:text-white transition-colors">
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-ink block truncate">Orders</span>
              <span className="text-[10px] text-ash font-mono">{orders?.length ?? 0} Placed</span>
            </div>
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center gap-3 rounded-xl border border-stone/60 bg-paper-pure p-3.5 shadow-xs hover:border-primary transition-all group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone/40 text-ink group-hover:bg-primary group-hover:text-white transition-colors">
              <Heart className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-ink block truncate">Wishlist</span>
              <span className="text-[10px] text-ash font-mono">{wishlistCount} Saved</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 rounded-xl border border-stone/60 bg-paper-pure p-3.5 shadow-xs hover:border-primary transition-all cursor-pointer group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone/40 text-ink group-hover:bg-primary group-hover:text-white transition-colors">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-ink block truncate">Coupons</span>
              <span className="text-[10px] text-ash font-mono">2 Available</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-stone/60 bg-paper-pure p-3.5 shadow-xs hover:border-primary transition-all cursor-pointer group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone/40 text-ink group-hover:bg-primary group-hover:text-white transition-colors">
              <Headphones className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-ink block truncate">Help Center</span>
              <span className="text-[10px] text-ash font-mono">24x7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Account Settings List */}
      <div className="rounded-xl border border-stone/60 bg-paper-pure overflow-hidden shadow-xs divide-y divide-stone/40">
        <div className="bg-stone/30 px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-ash">
          Account Settings
        </div>

        <Link
          href="/account/settings"
          className="flex min-h-[56px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">Edit Profile</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </Link>

        <Link
          href="/account/addresses"
          className="flex min-h-[56px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">Saved Addresses</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </Link>

        <div className="flex min-h-[56px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">Saved Cards &amp; Payment Methods</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </div>

        <div className="flex min-h-[56px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">Notification Settings</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </div>

        <div className="flex min-h-[56px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">Privacy &amp; Security</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </div>
      </div>

      {/* 4. My Activity */}
      <div className="rounded-xl border border-stone/60 bg-paper-pure overflow-hidden shadow-xs divide-y divide-stone/40">
        <div className="bg-stone/30 px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-ash">
          My Activity
        </div>

        <Link
          href="/account/orders"
          className="flex min-h-[52px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Package className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">My Orders</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </Link>

        <div className="flex min-h-[52px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">My Reviews</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </div>

        <div className="flex min-h-[52px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">Questions &amp; Answers</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </div>
      </div>

      {/* 5. Help & Information */}
      <div className="rounded-xl border border-stone/60 bg-paper-pure overflow-hidden shadow-xs divide-y divide-stone/40">
        <div className="bg-stone/30 px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-ash">
          Help &amp; Information
        </div>

        <div className="flex min-h-[52px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">Help Center &amp; Support</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </div>

        <div className="flex min-h-[52px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">Terms &amp; Conditions</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </div>

        <div className="flex min-h-[52px] items-center justify-between px-4 py-3 hover:bg-stone/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-ash shrink-0" />
            <span className="text-xs font-bold text-ink">Privacy Policy</span>
          </div>
          <ChevronRight className="h-4 w-4 text-ash" />
        </div>
      </div>

      {/* 6. Logout Action Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full rounded-xl border border-error/30 bg-error/5 py-3 text-xs font-bold text-error hover:bg-error hover:text-white transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout from Account</span>
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone/40 pb-3">
              <h3 className="font-editorial text-base font-bold text-ink">Confirm Logout</h3>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1 text-ash hover:text-ink rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-graphite font-body leading-relaxed">
              Are you sure you want to sign out of your Maison Noir account?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-bold text-ash hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="rounded-xl bg-error px-4 py-2 text-xs font-bold text-white hover:bg-error/90 transition-colors shadow-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




