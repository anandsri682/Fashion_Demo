"use client";

import { MapPin, ChevronDown, Bell, Search, Camera } from "lucide-react";
import { useState } from "react";
import { SearchOverlay } from "./SearchOverlay";
import { useSettingsStore } from "@/store/settingsStore";

export function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const settings = useSettingsStore((s) => s.settings);
  const storeName = settings.storeName || "MAISON NOIR";

  return (
    <>
      <div className="bg-white border-b border-slate-100 px-4 pt-3 pb-3.5 lg:hidden sticky top-0 z-30 shadow-xs">
        {/* Top Location & Notification Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                <span>Deliver to</span>
                <span className="font-bold text-slate-900">Home - 400001</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 text-slate-700 hover:bg-slate-200/70 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[8px] font-bold text-white ring-2 ring-white">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar Input Row */}
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between gap-2 rounded-xl bg-slate-100/90 border border-slate-200/60 px-3.5 py-2.5 text-xs text-slate-400 hover:border-rose-400 transition-all shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 font-normal">Search for products, brands and more...</span>
          </div>
          <Camera className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
