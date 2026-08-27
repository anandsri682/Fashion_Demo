"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { PageLoader } from "@/components/ui/Skeleton";

const links = [
  {
    label: "Overview",
    href: "/account",
    icon: User,
  },
  {
    label: "My Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    label: "Account Settings",
    href: "/account/settings",
    icon: Settings,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { ready } = useRequireAuth();

  if (!ready) {
    return <PageLoader />;
  }

  return (
    <div className="container-x py-12 lg:py-16">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left border-b border-stone/50 pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-brass" />
            <p className="text-[10px] uppercase tracking-widest2 text-brass font-semibold">Private Client Portal</p>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-light text-ink">My Account</h1>
        </div>
        <p className="text-xs font-mono text-ash">Maison Noir Membership & Ledger</p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        {/* Navigation Sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 lg:flex-col lg:overflow-visible border-b lg:border-b-0 border-stone/40">
            {links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex shrink-0 items-center gap-3.5 whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-luxury transition-all duration-300 border-l-2 lg:whitespace-normal",
                    active
                      ? "border-brass bg-stone-light/60 text-ink shadow-xs"
                      : "border-transparent text-graphite hover:bg-stone/30 hover:text-ink"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-colors", active ? "text-brass" : "text-ash")} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-paper border border-stone/50 p-6 sm:p-8 shadow-subtle min-h-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}