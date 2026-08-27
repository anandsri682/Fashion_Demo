"use client";

import Link from "next/link";
import { Bell, User, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function MobileAdminHeader({ title }: { title?: string }) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-4 py-3.5 flex items-center justify-between shadow-md md:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 font-bold text-xs uppercase shadow-xs">
          M
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block leading-none">MAISON NOIR</span>
          <h1 className="text-sm font-extrabold text-white leading-tight mt-0.5">{title || "Admin Panel"}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/admin/notifications" className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
        </Link>
        <Link href="/admin/profile" className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs">
          {user?.firstName ? user.firstName[0] : <User className="h-4 w-4" />}
        </Link>
      </div>
    </header>
  );
}
