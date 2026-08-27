"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { PageLoader } from "@/components/ui/Skeleton";
import { Toaster } from "@/components/ui/Toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { ready } = useRequireAuth({ adminOnly: true });

  if (!ready) return <PageLoader />;

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar />
      <div className="flex-1">
        <AdminNavbar />
        <main className="px-6 py-8 lg:px-10">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
