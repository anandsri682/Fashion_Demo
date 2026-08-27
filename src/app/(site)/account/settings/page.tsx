"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toastStore";
import { isValidEmail, isValidPhone } from "@/lib/validation";

export default function AccountSettingsPage() {
  const { user, setUser } = useAuthStore();
  const push = useToastStore((s) => s.push);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function saveProfile() {
    const errs: Record<string, string> = {};
    if (!isValidEmail(form.email)) errs.email = "Enter a valid email";
    if (!isValidPhone(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
    setErrors(errs);
    if (Object.keys(errs).length > 0 || !user) return;
    setUser({ ...user, ...form });
    push("Profile details updated successfully");
  }

  function changePassword() {
    if (passwordForm.next.length < 8) {
      push("New password must be at least 8 characters", "error");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      push("Passwords do not match", "error");
      return;
    }
    setPasswordForm({ current: "", next: "", confirm: "" });
    push("Password credentials updated successfully");
  }

  if (!user) return null;

  return (
    <div className="space-y-12">
      {/* Profile Section */}
      <div>
        <div className="border-b border-stone/40 pb-3 mb-6">
          <h2 className="font-editorial text-2xl font-medium text-ink">Personal Profile</h2>
          <p className="mt-1 text-xs text-ash font-body">Update your Maison Noir client record and contact details.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="First Name" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
          <Input label="Last Name" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
          <Input label="Email Address" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email} />
          <Input label="Phone Number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} error={errors.phone} />
        </div>
        <Button variant="gold" className="mt-6" size="lg" onClick={saveProfile}>
          Save Profile Details
        </Button>
      </div>

      {/* Security Credentials Section */}
      <div className="border-t border-stone/50 pt-10">
        <div className="border-b border-stone/40 pb-3 mb-6">
          <h2 className="font-editorial text-2xl font-medium text-ink">Security Credentials</h2>
          <p className="mt-1 text-xs text-ash font-body">Manage your secret passphrase and authentication key.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Current Passphrase"
              type="password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
            />
          </div>
          <Input
            label="New Passphrase"
            type="password"
            value={passwordForm.next}
            onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))}
          />
          <Input
            label="Confirm New Passphrase"
            type="password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
          />
        </div>
        <Button className="mt-6" variant="outline" size="lg" onClick={changePassword}>
          Update Passphrase
        </Button>
      </div>
    </div>
  );
}

