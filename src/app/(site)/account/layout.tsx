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
  const { ready } = useRequireAuth();

  if (!ready) {
    return <PageLoader />;
  }

  return (
    <div className="container-x py-6 lg:py-10 max-w-4xl mx-auto">
      {children}
    </div>
  );
}