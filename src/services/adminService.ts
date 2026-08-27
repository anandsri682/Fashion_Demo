import { apiFetch } from "@/lib/api";
import { AdminDashboardStats, AdminUserRow } from "@/types";

interface DashboardApiResponse {
  success: boolean;
  message: string;
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
    [key: string]: any;
  };
  lowStockProducts: any[];
  outOfStockProducts?: any[];
  bestSellingProducts?: any[];
  recentOrders: any[];
  recentUsers: any[];
}


interface UserListApiResponse {
  success: boolean;
  message: string;
  users: any[];
}

export const adminService = {
  async getDashboard(period: string = "ALL"): Promise<AdminDashboardStats & { outOfStockProductsList: any[]; lowStockProductsList: any[]; bestSellingProductsList: any[] }> {
    try {
      const res = await apiFetch<DashboardApiResponse>(`/admin/dashboard?period=${period}`);
      const stats = res.stats || {};
      const lowStockList = res.lowStockProducts || [];
      const outOfStockList = res.outOfStockProducts || [];
      const bestSellers = (res.bestSellingProducts || []).map((b: any) => ({
        product: {
          id: b.product?._id || b.product?.id,
          title: b.product?.title || "Product",
          price: b.product?.price || 0,
          images: b.product?.images || [],
          category: b.product?.category || "Apparel",
          stock: b.product?.stock || 0,
        },
        unitsSold: b.unitsSold || 0,
        totalRevenue: b.totalRevenue || 0,
      }));

      return {
        totalOrders: stats.totalOrders || 0,
        totalRevenue: stats.totalRevenue || 0,
        totalProducts: stats.totalProducts || 0,
        totalUsers: stats.totalUsers || 0,
        pendingOrders: stats.pendingOrders || 0,
        deliveredOrders: stats.deliveredOrders || 0,
        lowStockProducts: lowStockList.length,
        lowStockProductsList: lowStockList.map((p: any) => ({
          id: p._id || p.id,
          title: p.title,
          stock: p.stock,
          category: p.category,
          price: p.price,
          image: p.images?.[0]?.url || "",
        })),
        outOfStockProductsList: outOfStockList.map((p: any) => ({
          id: p._id || p.id,
          title: p.title,
          stock: p.stock,
          category: p.category,
          price: p.price,
          image: p.images?.[0]?.url || "",
        })),
        bestSellingProductsList: bestSellers,
        recentOrders: (res.recentOrders || []).map((o: any) => ({
          id: o._id || o.id,
          userId: o.user?._id || o.user,
          customerName: o.user ? `${o.user.firstName || ""} ${o.user.lastName || ""}`.trim() : "Customer",
          customerEmail: o.user?.email || "",
          customerPhone: o.user?.phone || "",
          items: (o.items || []).map((item: any) => ({
            productId: item.product?._id || item.product,
            title: item.title,
            image: item.image || "",
            price: item.price,
            quantity: item.quantity,
          })),
          shippingAddress: o.shippingAddress || {},
          billingAddress: o.billingAddress || {},
          paymentMethod: o.paymentMethod || "UPI",
          subtotal: o.subtotal || 0,
          discount: o.discount || 0,
          shipping: o.shipping || 0,
          tax: o.tax || 0,
          total: o.total || 0,
          status: o.orderStatus === "DELIVERED" ? "Delivered" : o.orderStatus === "CANCELLED" ? "Cancelled" : "Pending",
          createdAt: o.createdAt,
          expectedDelivery: o.expectedDeliveryDate || o.createdAt,
        })),
        recentUsers: (res.recentUsers || []).map((u: any) => ({
          id: u._id || u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          role: u.role || "USER",
          createdAt: u.createdAt,
          orderCount: u.orderCount || 0,
          totalSpent: u.totalSpend || 0,
        })),
        revenueByMonth: [],
        ordersByMonth: [],
        topProducts: bestSellers as any,
      };

    } catch {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        lowStockProducts: 0,
        lowStockProductsList: [],
        outOfStockProductsList: [],
        bestSellingProductsList: [],
        recentOrders: [],
        recentUsers: [],
        revenueByMonth: [],
        ordersByMonth: [],
        topProducts: [],
      };
    }
  },

  async updateProductStock(id: string, stock: number): Promise<void> {
    await apiFetch(`/admin/products/${id}/stock`, {
      method: "PUT",
      body: JSON.stringify({ stock }),
    });
  },

  async updateAdminProfile(data: Record<string, any>): Promise<any> {
    return await apiFetch("/admin/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getUsers(): Promise<AdminUserRow[]> {
    try {
      const res = await apiFetch<UserListApiResponse>("/admin/users");
      return (res.users || []).map((u: any) => ({
        id: u._id || u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        role: u.role || "USER",
        createdAt: u.createdAt,
        orderCount: u.orderCount || 0,
        totalSpent: u.totalSpent || u.totalSpend || 0,
      }));
    } catch {
      return [];
    }
  },
};


