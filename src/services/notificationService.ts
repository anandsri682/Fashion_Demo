import { api } from '@/lib/api';

export interface NotificationItem {
  id: string;
  _id?: string;
  title: string;
  message: string;
  type: 'ORDER' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'CUSTOMER';
  read: boolean;
  link?: string;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    const res = await api.get<{ notifications: NotificationItem[]; unreadCount: number }>('/admin/notifications');
    return res;
  },

  async markAsRead(id: string): Promise<NotificationItem> {
    const res = await api.put<{ notification: NotificationItem }>(`/admin/notifications/${id}/read`, {});
    return res.notification;
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/admin/notifications/read-all', {});
  },
};
