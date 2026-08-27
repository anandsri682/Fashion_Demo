"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { MobileAdminHeader } from "@/components/admin/MobileAdminHeader";
import { MobileAdminNav } from "@/components/admin/MobileAdminNav";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { PageLoader } from "@/components/ui/Skeleton";
import { Toaster } from "@/components/ui/Toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { ready } = useRequireAuth({ adminOnly: true });

  if (!ready) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Mobile Top Admin Header */}
      <MobileAdminHeader />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <div className="flex-1 min-w-0">
        {/* Desktop Header Navbar */}
        <div className="hidden md:block">
          <AdminNavbar />
        </div>
        <main className="px-4 py-6 sm:px-6 lg:px-10">{children}</main>
      </div>

      {/* Mobile Bottom Admin Bar */}
      <MobileAdminNav />

      <Toaster />
    </div>
  );
}

