"use client";

import { useAuth } from "@/hooks/useAuth";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminNavbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-stone bg-paper px-6 py-4">
      <button className="text-ink lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
        <Menu className="h-5 w-5" />
      </button>
      <span className="font-display text-lg text-ink lg:hidden">Admin</span>
      <div className="ml-auto flex items-center gap-4">
        <span className="hidden text-sm text-graphite sm:block">{user?.firstName || "Admin"}</span>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-ash hover:text-ink">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
      {open && (
        <nav className="absolute left-0 top-full flex w-full flex-col border-b border-stone bg-paper py-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn("flex items-center gap-3 px-6 py-3 text-sm text-graphite")}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
