"use client";

import Link from "next/link";
import { ArrowRight, Instagram, Twitter, Facebook, ShieldCheck, Truck, RefreshCw } from "lucide-react";


const columns = [
  {
    title: "Collections",
    links: [
      { label: "Women's Edit", href: "/women" },
      { label: "Men's Edit", href: "/men" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Featured Atelier", href: "/collections/featured" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { label: "Track Orders", href: "/account/orders" },
      { label: "Account Settings", href: "/account/settings" },
      { label: "Saved Wishlist", href: "/wishlist" },
      { label: "Shipping & Delivery", href: "/cart" },
    ],
  },
  {
    title: "Maison",
    links: [
      { label: "About Studio", href: "/" },
      { label: "Sustainability", href: "/" },
      { label: "Store Locator", href: "/" },
    ],
  },
];

import { useSettingsStore } from "@/store/settingsStore";

export function Footer() {
  const settings = useSettingsStore((s) => s.settings);
  const storeName = settings.storeName || "MAISON NOIR";

  return (
    <footer className="border-t border-stone/80 bg-ink text-white">
      {/* Main Footer Links */}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-12 lg:px-8">
        {/* Brand & Newsletter Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <Link href="/" className="inline-block font-editorial text-2xl font-bold tracking-[0.25em] text-white uppercase">
              {storeName}
            </Link>
            <p className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold mt-0.5">HAUTE COUTURE &middot; EST. 2026</p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-ash font-body">
              Considered clothing, cut for everyday living. Designed with an emphasis on pure cloth, precision tailoring, and timeless elegance.
            </p>
          </div>


          <div className="mt-8">
            <p className="text-xs uppercase tracking-wider text-white font-bold mb-2">Join the Club</p>
            <p className="text-xs text-ash mb-3">Receive early access to seasonal edits and private collection drops.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm border border-white/20 focus-within:border-primary transition-colors rounded-full overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-white/10 px-4 py-2.5 text-xs text-white placeholder:text-ash focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-crimson-gradient px-5 py-2.5 text-white hover:bg-primary-dark transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Link Columns */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-5 text-xs uppercase tracking-wider text-primary font-bold">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-xs text-ash hover:text-white transition-colors hover-underline-crimson inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/40 px-6 py-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-ash sm:flex-row">
          <p>© {new Date().getFullYear()} MAISON NOIR. All rights reserved.</p>
          <div className="flex items-center gap-4 text-ash">
            <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}


