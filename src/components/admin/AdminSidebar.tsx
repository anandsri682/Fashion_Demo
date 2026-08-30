"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  Package,
  Boxes,
  FolderTree,
  ShoppingCart,
  Users,
  Ticket,
  Image as ImageIcon,
  Bell,
  Settings,
  UserCheck,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";


const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons & Sales", href: "/admin/discounts", icon: Ticket },
  { label: "Homepage Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Store Settings", href: "/admin/settings", icon: Settings },
  { label: "Admin Profile", href: "/admin/profile", icon: UserCheck },
];

import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

export function AdminSidebar() {
  const pathname = usePathname();
  const settings = useSettingsStore((s) => s.settings);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const storeName = settings.storeName || "MAISON NOIR";

  return (
    <aside className="hidden w-64 shrink-0 border-r border-stone/60 bg-paper-pure lg:block min-h-[calc(100vh-80px)] shadow-subtle">
      <div className="px-6 py-6 border-b border-stone/50">
        <span className="font-editorial text-xl font-bold tracking-widest text-ink uppercase">{storeName}</span>
        <p className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold mt-0.5">Admin Management Studio</p>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/admin" && pathname?.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200",
                active
                  ? "bg-crimson-gradient text-white shadow-crimson"
                  : "text-graphite hover:bg-primary/10 hover:text-primary"
              )}
            >
              <l.icon className="h-4 w-4 shrink-0" />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 px-3 border-t border-stone/50 pt-4 space-y-2 pb-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-stone bg-paper text-xs font-bold text-ink hover:border-primary hover:text-primary transition-all shadow-2xs"
        >
          <ShoppingBag className="h-4 w-4 text-primary shrink-0" />
          <span>View Customer Store</span>
        </Link>
      </div>
    </aside>
  );
}


