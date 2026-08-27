"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";

export function MobileBottomNav({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const user = useAuthStore((s) => s.user);

  // Hide bottom nav on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const accountHref = user ? "/account" : "/login";

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Search",
      href: "/search",
      icon: Search,
      isActive: pathname === "/search",
      onClick: onOpenSearch,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingBag,
      isActive: pathname === "/cart",
      badge: itemCount,
    },
    {
      label: "Account",
      href: accountHref,
      icon: User,
      isActive: pathname.startsWith("/account") || pathname === "/login" || pathname === "/register",
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden pb-safe"
    >
      <div className="flex items-center justify-around h-15 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 transition-all duration-200 active:scale-95",
                  item.isActive && "text-rose-600 font-bold"
                )}
              >
                <div className="relative">
                  <Icon className={cn("h-5 w-5 stroke-[1.8]", item.isActive && "stroke-[2.3] text-rose-600")} />
                </div>
                <span className={cn("text-[10px] mt-0.5 font-medium tracking-tight", item.isActive && "text-rose-600 font-bold")}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 transition-all duration-200 active:scale-95",
                item.isActive && "text-rose-600 font-bold"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5 stroke-[1.8]", item.isActive && "stroke-[2.3] text-rose-600")} />
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn("text-[10px] mt-0.5 font-medium tracking-tight", item.isActive && "text-rose-600 font-bold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
