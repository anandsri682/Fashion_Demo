"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, Heart, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { CartDrawer } from "./CartDrawer";
import { settingsService } from "@/services/settingsService";


const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Sale", href: "/products?sort=price-asc", isSale: true },
];


import { useSettingsStore } from "@/store/settingsStore";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);

  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const user = useAuthStore((s) => s.user);

  const settings = useSettingsStore((s) => s.settings);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const storeName = settings.storeName || "MAISON NOIR";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 hidden lg:block",
          scrolled
            ? "header-glass border-b border-stone/60 shadow-subtle py-3.5"
            : "bg-paper-pure border-b border-stone/30 py-5"
        )}
      >

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Toggle */}
          <button
            className="p-2 text-ink hover:text-primary transition-colors lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex flex-col items-center justify-center font-editorial tracking-[0.25em] text-ink transition-opacity hover:opacity-90"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase text-ink">{storeName}</span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-primary font-sans font-bold hidden sm:block -mt-0.5">
              HAUTE COUTURE &middot; EST. 2026
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            {primaryLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <div
                  key={l.label}
                  className="relative py-2"
                  onMouseEnter={() => (l.label === "Women" || l.label === "Men" ? setActiveMega(l.label) : setActiveMega(null))}
                  onMouseLeave={() => setActiveMega(null)}
                >
                  <Link
                    href={l.href}
                    className={cn(
                      "relative text-xs uppercase tracking-luxury font-bold transition-colors py-1 hover:text-primary",
                      isActive ? "text-primary font-extrabold" : l.isSale ? "text-primary font-extrabold" : "text-ink"
                    )}
                  >
                    {l.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-crimson-gradient rounded-full" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search collection"
              className="flex items-center gap-2 rounded-full border border-stone bg-paper px-3 py-1.5 text-xs text-ash hover:border-primary hover:text-primary transition-all hidden md:flex"
            >
              <Search className="h-3.5 w-3.5 text-primary" />
              <span className="font-body text-[11px]">Search products...</span>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search collection"
              className="p-2 text-ink hover:text-primary transition-colors md:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 text-ink hover:text-primary transition-colors hidden sm:block"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-xs animate-heartPulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href={user ? (user.role === "ADMIN" ? "/admin" : "/account") : "/login"}
              aria-label="User Account"
              className="p-2 text-ink hover:text-primary transition-colors hidden sm:block"
              title={user ? (user.role === "ADMIN" ? "Admin Dashboard" : "My Account") : "Login / Sign In"}
            >
              <User className="h-5 w-5" />
            </Link>


            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-2.5 rounded-full bg-ink text-white hover:bg-primary transition-all duration-300 shadow-xs flex items-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-mono font-bold">{itemCount}</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

    </>
  );
}


