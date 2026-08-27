"use client";

import { useEffect, useState } from "react";
import { notificationService, NotificationItem } from "@/services/notificationService";
import { formatDate } from "@/lib/format";
import { useToastStore } from "@/store/toastStore";
import { Bell, CheckCheck, ShoppingBag, AlertTriangle, XCircle, UserCheck } from "lucide-react";
import Link from "next/link";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch {
      push("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await notificationService.markAllAsRead();
      push("All notifications marked as read");
      await loadNotifications();
    } catch {
      push("Failed to update notifications");
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch {
      // Ignore error
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/50 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">REAL-TIME SYSTEM ALERTS</span>
          <h1 className="font-editorial text-3xl font-bold text-ink">Notifications ({unreadCount} Unread)</h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 rounded-lg border border-primary text-primary px-4 py-2 text-xs font-bold hover:bg-primary/10 transition-all w-fit"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="rounded-xl border border-stone/60 bg-paper-pure shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-ash font-mono animate-pulse">Loading notification alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-ash font-mono">No notification alerts recorded in MongoDB yet.</div>
        ) : (
          <div className="divide-y divide-stone/50">
            {notifications.map((n) => {
              const id = n.id || n._id || "";
              return (
                <div
                  key={id}
                  onClick={() => !n.read && handleMarkAsRead(id)}
                  className={`flex items-start justify-between p-5 transition-colors cursor-pointer ${
                    !n.read ? "bg-primary/5 font-bold" : "hover:bg-stone/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      {n.type === "ORDER" ? (
                        <ShoppingBag className="h-4 w-4" />
                      ) : n.type === "LOW_STOCK" ? (
                        <AlertTriangle className="h-4 w-4 text-brass" />
                      ) : n.type === "OUT_OF_STOCK" ? (
                        <XCircle className="h-4 w-4 text-error" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink">{n.title}</h4>
                      <p className="mt-0.5 text-xs text-graphite font-body">{n.message}</p>
                      <span className="mt-2 block text-[10px] font-mono text-ash">{formatDate(n.createdAt)}</span>
                    </div>
                  </div>

                  {n.link && (
                    <Link
                      href={n.link}
                      className="rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white hover:bg-primary transition-colors shrink-0"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
