import { api } from '@/lib/api';

export interface BannerItem {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image: string;
  bannerType: 'HERO' | 'PROMO' | 'CATEGORY';
  displayOrder: number;
  isActive: boolean;
}

export const bannerService = {
  async getPublicBanners(): Promise<BannerItem[]> {
    const res = await api.get<{ banners: BannerItem[] }>('/banners');
    return res.banners;
  },

  async listAllAdminBanners(): Promise<BannerItem[]> {
    const res = await api.get<{ banners: BannerItem[] }>('/admin/banners');
    return res.banners;
  },

  async createBanner(data: Partial<BannerItem>): Promise<BannerItem> {
    const res = await api.post<{ banner: BannerItem }>('/admin/banners', data);
    return res.banner;
  },

  async updateBanner(id: string, data: Partial<BannerItem>): Promise<BannerItem> {
    const res = await api.put<{ banner: BannerItem }>(`/admin/banners/${id}`, data);
    return res.banner;
  },

  async deleteBanner(id: string): Promise<void> {
    await api.delete(`/admin/banners/${id}`);
  },
};
