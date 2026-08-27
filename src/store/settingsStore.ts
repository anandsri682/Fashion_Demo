"use client";

import { create } from "zustand";
import { settingsService, StoreSettings } from "@/services/settingsService";

interface SettingsState {
  settings: StoreSettings;
  loaded: boolean;
  fetchSettings: () => Promise<StoreSettings>;
  updateSettings: (data: Partial<StoreSettings>) => Promise<StoreSettings>;
}

const defaultSettings: StoreSettings = {
  storeName: "MAISON NOIR",
  supportEmail: "support@maisonnoir.com",
  supportPhone: "+91 9999999999",
  freeShippingThreshold: 999,
  standardShippingFee: 99,
  taxPercentage: 5,
  currency: "INR",
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  loaded: false,

  fetchSettings: async () => {
    try {
      const data = await settingsService.getSettings();
      if (data && data.storeName) {
        set({ settings: data, loaded: true });
        return data;
      }
    } catch {
      // Fallback to default
    }
    set({ loaded: true });
    return get().settings;
  },

  updateSettings: async (data) => {
    const updated = await settingsService.updateSettings(data);
    set({ settings: updated, loaded: true });
    return updated;
  },
}));
