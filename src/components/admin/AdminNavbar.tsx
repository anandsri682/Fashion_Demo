"use client";

import { useAuth } from "@/hooks/useAuth";
import { LogOut, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function AdminNavbar() {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-stone/60 bg-paper-pure px-6 py-3.5 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Admin Studio
          </span>
          <span className="text-xs font-bold text-ink hidden sm:inline">
            Welcome, {user?.firstName || "Administrator"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View Customer Store Action */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-stone bg-paper px-3.5 py-1.5 text-xs font-bold text-ink hover:border-primary hover:text-primary transition-all shadow-xs"
            title="Browse customer storefront without logging out"
          >
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">View Store</span>
          </Link>

          {/* Admin Logout Action */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-error/10 border border-error/20 px-3.5 py-1.5 text-xs font-bold text-error hover:bg-error hover:text-white transition-all shadow-xs"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-stone/40">
            <div className="flex items-center justify-between border-b border-stone/30 pb-3">
              <h3 className="font-editorial text-base font-bold text-ink">Admin Session Logout</h3>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1 text-ash hover:text-ink rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-graphite font-body leading-relaxed">
              Are you sure you want to terminate your authenticated Administrator session and logout?
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
                Logout Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

