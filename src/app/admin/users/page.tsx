"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { AdminUserRow } from "@/types";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { formatCurrency, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [selected, setSelected] = useState<AdminUserRow | null>(null);

  useEffect(() => {
    adminService.getUsers().then(setUsers);
  }, []);

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">Registered Users</h1>

      {users === null ? (
        <DashboardSkeleton />
      ) : (
        <div className="overflow-x-auto border border-stone">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-stone bg-stone/40 text-xs uppercase tracking-wide text-graphite">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total Spent</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="cursor-pointer border-b border-stone last:border-0 hover:bg-stone/20"
                  onClick={() => setSelected(u)}
                >
                  <td className="px-4 py-3 text-ink">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3 text-ash">{u.email}</td>
                  <td className="px-4 py-3 text-ash">{u.phone}</td>
                  <td className="px-4 py-3 text-ash">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-ink">{u.orderCount}</td>
                  <td className="px-4 py-3 text-ink">{formatCurrency(u.totalSpent)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === "ADMIN" ? "brass" : "default"}>{u.role}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="User Details">
        {selected && (
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-ink">
              {selected.firstName} {selected.lastName}
            </p>
            <p className="text-ash">{selected.email}</p>
            <p className="text-ash">{selected.phone}</p>
            <p className="text-ash">Registered {formatDate(selected.createdAt)}</p>
            <p className="text-ash">
              {selected.orderCount} orders · {formatCurrency(selected.totalSpent)} total spend
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
