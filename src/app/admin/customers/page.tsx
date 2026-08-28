"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { AdminUserRow } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useToastStore } from "@/store/toastStore";
import { Users, Search, ShoppingBag, IndianRupee } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    adminService
      .getUsers()
      .then(setCustomers)
      .catch(() => push("Failed to load customers"))
      .finally(() => setLoading(false));
  }, [push]);

  const filtered = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/50 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">CUSTOMER MANAGEMENT</span>
          <h1 className="font-editorial text-3xl font-bold text-ink">Registered Customers ({customers.length})</h1>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ash" />
        <input
          type="text"
          placeholder="Search by customer name or email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-stone/70 bg-paper-pure px-4 pl-10 py-2.5 text-xs font-mono text-ink placeholder:text-ash focus:border-primary focus:outline-none shadow-xs"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-mono animate-pulse">Loading registered customers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-mono">No customer accounts found.</div>
        ) : (
          <>
            {/* Mobile Customer Cards View */}
            <div className="flex flex-col divide-y divide-slate-100 md:hidden">
              {filtered.map((c) => (
                <div key={c.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{c.firstName} {c.lastName}</span>
                    <span className="text-[10px] font-mono text-slate-400">Joined: {formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono">{c.email}</p>
                  <p className="text-xs text-slate-500 font-mono">Phone: {c.phone || "N/A"}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-rose-600 font-mono">
                      <ShoppingBag className="h-3.5 w-3.5" /> {c.orderCount || 0} Orders
                    </span>
                    <span className="font-extrabold text-slate-900 font-mono">{formatCurrency(c.totalSpent || 0)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View with Horizontal Scroll Container */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-mono font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4">Orders</th>
                    <th className="p-4">Total Spending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{c.firstName} {c.lastName}</td>
                      <td className="p-4 font-mono text-slate-600">{c.email}</td>
                      <td className="p-4 font-mono text-slate-600">{c.phone || "N/A"}</td>
                      <td className="p-4 text-slate-600">{formatDate(c.createdAt)}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 font-mono">
                          <ShoppingBag className="h-3.5 w-3.5" /> {c.orderCount || 0}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-slate-900 font-mono">{formatCurrency(c.totalSpent || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
