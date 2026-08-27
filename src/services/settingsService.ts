import { api } from '@/lib/api';

export interface StoreSettings {
  storeName: string;
  storeDescription?: string;
  supportEmail: string;
  supportPhone?: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  taxPercentage: number;
  currency: string;
}

export const settingsService = {
  async getSettings(): Promise<StoreSettings> {
    const res = await api.get<{ settings: StoreSettings }>('/settings');
    return res.settings;
  },

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await api.put<{ settings: StoreSettings }>('/admin/settings', data);
    return res.settings;
  },
};
