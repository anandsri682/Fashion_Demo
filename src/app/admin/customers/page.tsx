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

      <div className="rounded-xl border border-stone/60 bg-paper-pure shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-ash font-mono animate-pulse">Loading registered customers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-ash font-mono">No customer accounts found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-stone/30 text-graphite font-mono font-bold uppercase border-b border-stone/50">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Total Spending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-primary/5 transition-colors">
                  <td className="p-4 font-bold text-ink">{c.firstName} {c.lastName}</td>
                  <td className="p-4 font-mono text-ash">{c.email}</td>
                  <td className="p-4 font-mono text-ash">{c.phone || "N/A"}</td>
                  <td className="p-4 text-ash">{formatDate(c.createdAt)}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 font-bold text-primary font-mono">
                      <ShoppingBag className="h-3.5 w-3.5" /> {c.orderCount || 0}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-ink font-mono">{formatCurrency(c.totalSpent || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
