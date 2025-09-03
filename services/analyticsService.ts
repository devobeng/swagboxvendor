export interface VendorDashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

import api from "./api";

export class AnalyticsService {
  static async getDashboard(): Promise<{
    success: boolean;
    data: VendorDashboardStats;
  }> {
    // Default zeroed stats
    const empty: VendorDashboardStats = {
      totalProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
    };

    try {
      // Try to fetch analytics and orders together
      const [analyticsRes, ordersRes] = await Promise.all([
        api.get("/vendor/analytics"),
        api.get("/vendor/orders"),
      ]);

      const analytics = analyticsRes.data?.data || {};
      const orders = (ordersRes.data?.data || []) as any[];

      const pendingOrders = orders.filter(
        (o: any) => o.status === "pending"
      ).length;

      const totalProducts = analytics.totalProducts ?? 0;
      const totalOrders = analytics.totalOrders ?? orders.length ?? 0;
      const totalRevenue = analytics.totalSales ?? 0;

      let monthlyRevenue = 0;
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        for (const order of orders) {
          const createdAt = new Date(order.createdAt);
          if (createdAt >= thirtyDaysAgo && Array.isArray(order.items)) {
            for (const item of order.items) {
              if (item?.price && item?.quantity) {
                monthlyRevenue += item.price * item.quantity;
              }
            }
          }
        }
      } catch {}

      return {
        success: true,
        data: {
          totalProducts,
          totalOrders,
          pendingOrders,
          totalRevenue,
          monthlyRevenue,
        },
      };
    } catch (err: any) {
      // If unauthorized/forbidden (e.g., unverified vendor), return zeros gracefully
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        return { success: true, data: empty };
      }
      // Any other error: still avoid breaking UI
      return { success: true, data: empty };
    }
  }
}
