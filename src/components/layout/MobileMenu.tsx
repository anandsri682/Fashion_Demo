"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, User, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Women's Collection", href: "/women", badge: "New" },
  { label: "Men's Collection", href: "/men" },
  { label: "New Arrivals", href: "/new-arrivals", badge: "2026" },
  { label: "Curated Collections", href: "/collections/featured" },
];

const secondaryLinks = [
  { label: "Saved Wishlist", href: "/wishlist", icon: Heart },
  { label: "My Account", href: "/account", icon: User },
  { label: "Shopping Bag", href: "/cart", icon: ShoppingBag },
];

export function MobileMenu({ open, isOpen, onClose }: { open?: boolean; isOpen?: boolean; onClose: () => void }) {
  const isVisible = open ?? isOpen ?? false;
  const user = useAuthStore((s) => s.user);

  return (
    <AnimatePresence>
      {isVisible && (

        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/60 backdrop-blur-xs lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed left-0 top-0 z-[95] flex h-full w-[85vw] max-w-sm flex-col bg-paper shadow-elevation lg:hidden border-r border-stone/50"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone/60 px-6 py-6 bg-stone-light/40">
              <div>
                <span className="font-editorial text-lg tracking-[0.2em] font-bold text-ink uppercase">MAISON&nbsp;NOIR</span>
                <p className="text-[9px] uppercase tracking-widest text-brass font-medium">Paris Studio</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-2 text-ink hover:text-brass transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Links */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="text-[10px] font-semibold uppercase tracking-luxury text-ash mb-3">Navigation</p>
              <nav className="flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={onClose}
                    className="group flex items-center justify-between border-b border-stone/30 py-3.5 text-sm uppercase tracking-luxury font-medium text-ink transition-colors hover:text-brass"
                  >
                    <span>{l.label}</span>
                    <div className="flex items-center gap-2">
                      {l.badge && (
                        <span className="bg-brass/10 text-brass text-[9px] font-mono px-2 py-0.5 uppercase tracking-wide border border-brass/20">
                          {l.badge}
                        </span>
                      )}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-transform duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 text-brass" />
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Account & Quick Actions */}
              <div className="mt-8 pt-6 border-t border-stone/60">
                <p className="text-[10px] font-semibold uppercase tracking-luxury text-ash mb-3">Account & Saved</p>
                <div className="flex flex-col gap-2">
                  {secondaryLinks.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2.5 text-xs font-medium text-graphite hover:text-ink hover:bg-stone/40 transition-colors"
                      >
                        <Icon className="h-4 w-4 text-brass" />
                        <span>{s.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer / User status */}
            <div className="border-t border-stone/60 bg-stone-light/50 p-6">
              {user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-ink">Signed in as</p>
                    <p className="text-xs text-brass font-medium">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-luxury text-ink underline font-semibold"
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex w-full items-center justify-center bg-ink py-3 text-xs font-medium uppercase tracking-luxury text-paper hover:bg-ink-light transition-colors"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

