"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Warehouse, MoreHorizontal, Users, Tag, Bell, Settings, X, ChevronRight, ShoppingBag, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/hooks/useAuth";

export function MobileAdminNav() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);


  const mainItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
  ];

  const moreItems = [
    { label: "Categories", href: "/admin/categories", icon: Tag },
    { label: "Coupons & Discounts", href: "/admin/discounts", icon: Tag },
    { label: "Customer List", href: "/admin/customers", icon: Users },
    { label: "System Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Admin Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Fixed Mobile Bottom Admin Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 text-slate-300 md:hidden shadow-2xl">
        <div className="flex h-16 items-center justify-around px-2">
          {mainItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  isActive ? "text-rose-500 font-bold" : "text-slate-400 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
              moreOpen ? "text-rose-500 font-bold" : "text-slate-400 hover:text-white"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* "More" Slide-Over Drawer */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-fadeIn">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 text-white max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-500">Admin Management</h3>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setMoreOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-white text-sm font-bold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-rose-500" />
                  <span>View Customer Store</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              {moreItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-rose-500" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>
              ))}

              <button
                onClick={() => {
                  setMoreOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/60 border border-rose-900 text-rose-400 text-sm font-bold hover:bg-rose-900 transition-colors mt-4"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-rose-500" />
                  <span>Logout from Admin</span>
                </div>
                <ChevronRight className="h-4 w-4 text-rose-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

