"use client";

import { useEffect, useState } from "react";
import {
  getTopPages,
  getMostViewedMenuItems,
  getBestSellingItems,
  getMostAddedToCart,
  PageTrackingData,
  MenuItemViewData,
  MenuItemOrderStats,
} from "@/features/admin/services/trackingServices";

import {
  getHighestRevenueItems,
  getCategoryStats,
  getTrackingStats,
} from "@/features/admin/services/statsServices";

import StatsCards from "@/features/admin/components/Dashboard/StatsCards";
import CartAddedChart from "@/features/admin/components/Dashboard/CartAddedChart";
import CategoryChart from "@/features/admin/components/Dashboard/CategoryChart";
import RevenueList from "@/features/admin/components/Dashboard/RevenueList";

interface TrackingStats {
  totalPageAccesses: number;
  totalMenuItemViews: number;
  totalOrders: number;
  totalQuantitySold: number;
  totalRevenue: number;
  totalTableUsage: number;
  uniquePages: number;
  uniqueMenuItems: number;
  uniqueTables: number;
}

interface CategoryStats {
  kategori: string;
  total_ordered: number;
  total_quantity: number;
  total_revenue: number;
}

export default function AdminDashboard() {
  const [mostAddedToCart, setMostAddedToCart] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<PageTrackingData[]>([]);
  const [mostViewedItems, setMostViewedItems] = useState<MenuItemViewData[]>([]);
  const [bestSellingItems, setBestSellingItems] = useState<MenuItemOrderStats[]>([]);
  const [highestRevenueItems, setHighestRevenueItems] = useState<MenuItemOrderStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);

  const [stats, setStats] = useState<TrackingStats>({
    totalPageAccesses: 0,
    totalMenuItemViews: 0,
    totalOrders: 0,
    totalQuantitySold: 0,
    totalRevenue: 0,
    totalTableUsage: 0,
    uniquePages: 0,
    uniqueMenuItems: 0,
    uniqueTables: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [
        pages,
        viewedItems,
        bestItems,
        revenueItems,
        categories,
        statistics,
        addedCart,
      ] = await Promise.all([
        getTopPages(5),
        getMostViewedMenuItems(5),
        getBestSellingItems(5),
        getHighestRevenueItems(5),
        getCategoryStats(),
        getTrackingStats(),
        getMostAddedToCart(5),
      ]);

      setMostAddedToCart(addedCart);
      setTopPages(pages);
      setMostViewedItems(viewedItems);
      setBestSellingItems(bestItems);
      setHighestRevenueItems(revenueItems);
      setCategoryStats(categories);
      setStats(statistics);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat("id-ID").format(num);
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Monitor performa menu, penjualan, dan aktivitas pengunjung
        </p>
      </div>

      {/* Statistics Cards */}
      <StatsCards
        stats={stats}
        formatNumber={formatNumber}
        formatCurrency={formatCurrency}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6">
        <CartAddedChart
          mostAddedToCart={mostAddedToCart}
          formatNumber={formatNumber}
        />

        <CategoryChart
          categoryStats={categoryStats}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
        />

        <RevenueList
          highestRevenueItems={highestRevenueItems}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
