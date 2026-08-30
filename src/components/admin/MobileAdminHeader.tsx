"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, ShoppingBag, LogOut, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

export function MobileAdminHeader({ title }: { title?: string }) {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-4 py-3 flex items-center justify-between shadow-md md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 font-bold text-xs uppercase shadow-xs">
            M
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block leading-none">MAISON NOIR</span>
            <h1 className="text-xs font-extrabold text-white leading-tight mt-0.5">{title || "Admin Panel"}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Customer Store Action */}
          <Link
            href="/"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-bold hover:bg-slate-700 transition-colors"
            title="View Storefront"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-rose-500" />
            <span>Store</span>
          </Link>

          {/* Notifications */}
          <Link href="/admin/notifications" className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
          </Link>

          {/* Logout Action */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="p-2 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-400 hover:bg-rose-900 transition-colors"
            title="Logout Admin"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs rounded-2xl bg-slate-900 p-5 shadow-2xl space-y-4 border border-slate-800 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Confirm Admin Logout</h3>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to log out of your Administrator account?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

