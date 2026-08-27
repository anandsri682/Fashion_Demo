"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { adminService } from "@/services/adminService";
import { useToastStore } from "@/store/toastStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserCheck, ShieldCheck } from "lucide-react";

export default function AdminProfilePage() {
  const { user, setUser } = useAuthStore();
  const push = useToastStore((s) => s.push);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
  });

  async function handleSave() {
    try {
      setSaving(true);
      const res = await adminService.updateAdminProfile(form);
      if (user && res.user) {
        setUser({ ...user, ...res.user });
      }
      push("Admin profile credentials saved to MongoDB!");
      setForm((f) => ({ ...f, password: "" }));
    } catch {
      push("Failed to update admin profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="border-b border-stone/50 pb-6">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">ADMIN SECURITY</span>
        <h1 className="font-editorial text-3xl font-bold text-ink">Administrator Profile</h1>
      </div>

      <div className="rounded-xl border border-stone/60 bg-paper-pure p-8 shadow-subtle space-y-6">
        <div className="flex items-center gap-3 text-primary font-bold text-sm border-b border-stone/50 pb-4">
          <ShieldCheck className="h-5 w-5" />
          <span>Authenticated Role: {user?.role || "ADMIN"}</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
          <Input label="Last Name" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
          <Input label="Email Address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label="Phone Number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </div>

        <div className="pt-2 border-t border-stone/50">
          <Input
            label="Change Password (optional)"
            type="password"
            placeholder="Enter new password (min 6 chars)"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <p className="mt-1 text-[10px] text-ash font-mono">Password hashes are stored securely using BCrypt in MongoDB.</p>
        </div>

        <Button onClick={handleSave} disabled={saving} variant="primary" className="w-full justify-center shadow-crimson">
          {saving ? "Saving Credentials..." : "Save Profile Credentials"}
        </Button>
      </div>
    </div>
  );
}
