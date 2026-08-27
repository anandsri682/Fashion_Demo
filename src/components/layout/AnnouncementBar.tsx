"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="relative z-50 flex items-center justify-center bg-crimson-gradient px-6 py-2.5 text-center text-[10px] sm:text-[11px] uppercase tracking-widest text-white shadow-xs">
      <div className="flex items-center gap-2 font-medium">
        <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
        <span>
          FREE EXPRESS SHIPPING ON ORDERS ABOVE <span className="font-bold underline decoration-white/50">₹999</span> &middot; EASY 30-DAY RETURNS
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 p-1 text-white/80 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}


