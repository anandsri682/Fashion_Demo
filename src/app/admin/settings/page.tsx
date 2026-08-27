"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toastStore";
import { settingsService, StoreSettings } from "@/services/settingsService";
import { adminService } from "@/services/adminService";

import { useSettingsStore } from "@/store/settingsStore";

export default function AdminSettingsPage() {
  const { user, setUser } = useAuthStore();
  const push = useToastStore((s) => s.push);
  const updateStoreSettings = useSettingsStore((s) => s.updateSettings);
  const fetchStoreSettings = useSettingsStore((s) => s.fetchSettings);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
  });

  const [settingsForm, setSettingsForm] = useState<StoreSettings>({
    storeName: "Maison Noir",
    storeDescription: "Haute Couture & Fine Apparel",
    supportEmail: "support@maisonnoir.com",
    supportPhone: "+91 98765 43210",
    freeShippingThreshold: 999,
    standardShippingFee: 99,
    taxPercentage: 5,
    currency: "INR",
  });

  useEffect(() => {
    fetchStoreSettings()
      .then((data) => {
        if (data) setSettingsForm(data);
      })
      .finally(() => setLoading(false));
  }, [fetchStoreSettings]);

  async function handleSaveProfile() {
    try {
      setSavingProfile(true);
      const updated = await adminService.updateAdminProfile(profileForm);
      if (user && updated.user) {
        setUser({ ...user, ...updated.user });
      }
      push("Admin profile saved to database");
    } catch {
      push("Failed to update admin profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveStoreSettings() {
    try {
      setSavingSettings(true);
      const updated = await updateStoreSettings(settingsForm);
      setSettingsForm(updated);
      push(`Store name "${updated.storeName}" saved and updated across entire website!`);
    } catch {
      push("Failed to save store settings");
    } finally {
      setSavingSettings(false);
    }
  }


  if (loading) {
    return <div className="p-8 text-sm text-ash animate-pulse">Loading settings from database...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="mb-2 font-editorial text-3xl font-bold text-ink">Admin Settings</h1>
        <p className="mb-8 text-xs font-mono text-ash">Manage store configuration and administrator profile credentials</p>

        <h2 className="mb-6 font-editorial text-xl font-bold text-ink">Administrator Profile</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" value={profileForm.firstName} onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))} />
          <Input label="Last Name" value={profileForm.lastName} onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))} />
          <Input label="Email" value={profileForm.email} onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label="Phone" value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} />
          <Input label="New Password (optional)" type="password" placeholder="Leave blank to keep unchanged" value={profileForm.password} onChange={(e) => setProfileForm((f) => ({ ...f, password: e.target.value }))} />
        </div>
        <Button className="mt-6 shadow-crimson" variant="primary" onClick={handleSaveProfile} disabled={savingProfile}>
          {savingProfile ? "Saving Profile..." : "Save Profile"}
        </Button>
      </div>

      <div className="border-t border-stone/60 pt-10">
        <h2 className="mb-6 font-editorial text-xl font-bold text-ink">Store Settings &amp; Business Rules</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Store Name" value={settingsForm.storeName} onChange={(e) => setSettingsForm((s) => ({ ...s, storeName: e.target.value }))} />
          <Input label="Support Email" value={settingsForm.supportEmail} onChange={(e) => setSettingsForm((s) => ({ ...s, supportEmail: e.target.value }))} />
          <Input label="Support Phone" value={settingsForm.supportPhone || ""} onChange={(e) => setSettingsForm((s) => ({ ...s, supportPhone: e.target.value }))} />
          <Input
            label="Free Shipping Threshold (₹)"
            type="number"
            value={settingsForm.freeShippingThreshold}
            onChange={(e) => setSettingsForm((s) => ({ ...s, freeShippingThreshold: Number(e.target.value) }))}
          />
          <Input
            label="Standard Shipping Fee (₹)"
            type="number"
            value={settingsForm.standardShippingFee}
            onChange={(e) => setSettingsForm((s) => ({ ...s, standardShippingFee: Number(e.target.value) }))}
          />
          <Input
            label="Tax Rate (%)"
            type="number"
            value={settingsForm.taxPercentage}
            onChange={(e) => setSettingsForm((s) => ({ ...s, taxPercentage: Number(e.target.value) }))}
          />
        </div>
        <Button className="mt-6 shadow-crimson" variant="primary" onClick={handleSaveStoreSettings} disabled={savingSettings}>
          {savingSettings ? "Saving Settings..." : "Save Store Settings"}
        </Button>
        <p className="mt-4 text-xs font-mono text-primary font-bold">
          ✓ Connected directly to MongoDB settings collection
        </p>
      </div>
    </div>
  );
}

