// Revenue and statistics tracking services
import { supabase } from "@/shared/lib/supabase";
import type { MenuItemOrderStats } from "./trackingServices";

/**
 * Get highest revenue menu items
 */
export async function getHighestRevenueItems(
    limit: number = 10
): Promise<MenuItemOrderStats[]> {
    try {
        const { data, error } = await supabase
            .from("menu_item_order_stats")
            .select("*")
            .order("total_revenue", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching highest revenue items:", error);
        return [];
    }
}

/**
 * Get comprehensive tracking statistics
 */
export async function getTrackingStats() {
    try {
        // Total page accesses
        const { data: pageData } = await supabase
            .from("page_tracking")
            .select("access_count");
        const totalPageAccesses =
            pageData?.reduce((sum, item) => sum + item.access_count, 0) || 0;

        // Total cart adds
        const { count: totalCartAdds } = await supabase
            .from("cart_add_tracking")
            .select("*", { count: "exact", head: true });

        // Total orders
        const { count: totalOrders } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true });

        // Total revenue
        const { data: revenueData } = await supabase
            .from("orders")
            .select("total_amount");
        const totalRevenue =
            revenueData?.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0) || 0;

        // Total quantity sold
        const { data: itemsSoldData } = await supabase
            .from("order_items")
            .select("quantity");
        const totalQuantitySold =
            itemsSoldData?.reduce((sum, item) => sum + item.quantity, 0) || 0;

        // Unique counts
        const { count: uniquePages } = await supabase
            .from("page_tracking")
            .select("*", { count: "exact", head: true });

        const { count: uniqueMenuItems } = await supabase
            .from("menu_items")
            .select("*", { count: "exact", head: true });

        return {
            totalPageAccesses,
            totalMenuItemViews: totalCartAdds || 0,
            totalOrders: totalOrders || 0,
            totalQuantitySold,
            totalRevenue,
            uniquePages: uniquePages || 0,
            uniqueMenuItems: uniqueMenuItems || 0,
            totalTableUsage: 0,
            uniqueTables: 0,
        };
    } catch (error) {
        console.error("Error fetching tracking stats:", error);

        return {
            totalPageAccesses: 0,
            totalMenuItemViews: 0,
            totalOrders: 0,
            totalQuantitySold: 0,
            totalRevenue: 0,
            totalTableUsage: 0,
            uniquePages: 0,
            uniqueMenuItems: 0,
            uniqueTables: 0,
        };
    }
}

/**
 * Get category performance statistics
 */
export async function getCategoryStats() {
    try {
        const { data, error } = await supabase
            .from("menu_item_order_stats")
            .select("*");

        if (error) throw error;

        // Group by category
        const categoryMap = new Map();

        data?.forEach((item) => {
            const category = item.kategori || "Unknown";
            const existing = categoryMap.get(category) || {
                kategori: category,
                total_ordered: 0,
                total_quantity: 0,
                total_revenue: 0,
            };

            categoryMap.set(category, {
                kategori: category,
                total_ordered: existing.total_ordered + item.total_ordered,
                total_quantity: existing.total_quantity + item.total_quantity,
                total_revenue: existing.total_revenue + Number(item.total_revenue),
            });
        });

        return Array.from(categoryMap.values()).sort(
            (a, b) => b.total_revenue - a.total_revenue
        );
    } catch (error) {
        console.error("Error fetching category stats:", error);
        return [];
    }
}
