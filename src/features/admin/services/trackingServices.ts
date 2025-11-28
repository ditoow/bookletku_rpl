// Types for tracking services
import { supabase } from "@/shared/lib/supabase";

export interface PageTrackingData {
  id: string;
  page_name: string;
  access_count: number;
  last_accessed: string;
  created_at: string;
}

export interface MenuItemViewData {
  id: string;
  menu_item_id: string;
  view_count: number;
  last_viewed: string;
  created_at: string;
  menu_items?: {
    nama_produk: string;
    kategori: string;
    harga: number;
    image_url?: string;
  };
}

export interface MenuItemOrderStats {
  id: string;
  menu_item_id: string;
  nama_produk: string;
  kategori: string;
  harga: number;
  image_url?: string;
  total_ordered: number;
  total_quantity: number;
  total_revenue: number;
  last_ordered: string;
  created_at: string;
}

/**
 * Get most added to cart items
 */
export async function getMostAddedToCart(limit = 5) {
  const { data, error } = await supabase
    .from("cart_add_tracking")
    .select(`
        id,
        menu_item_id,
        menu_items (
          nama_produk,
          kategori,
          harga
        )
      `);

  if (error) {
    console.error("Error fetching cart added tracking:", error);
    return [];
  }

  const grouped = data.reduce((acc: any, item: any) => {
    if (!acc[item.menu_item_id]) {
      acc[item.menu_item_id] = {
        menu_item_id: item.menu_item_id,
        menu_items: item.menu_items,
        total_added: 0,
      };
    }
    acc[item.menu_item_id].total_added += 1;
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a: any, b: any) => b.total_added - a.total_added)
    .slice(0, limit);
}

/**
 * Track page access
 */
export async function trackPageAccess(pageName: string): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from("page_tracking")
      .select("*")
      .eq("page_name", pageName)
      .single();

    if (existing) {
      await supabase
        .from("page_tracking")
        .update({
          access_count: existing.access_count + 1,
          last_accessed: new Date().toISOString(),
        })
        .eq("page_name", pageName);
    } else {
      await supabase.from("page_tracking").insert({
        page_name: pageName,
        access_count: 1,
      });
    }
  } catch (error) {
    console.error("Error tracking page access:", error);
  }
}

/**
 * Get top accessed pages
 */
export async function getTopPages(
  limit: number = 10
): Promise<PageTrackingData[]> {
  const { data } = await supabase
    .from("page_tracking")
    .select("*")
    .order("access_count", { ascending: false })
    .limit(limit);
  return data || [];
}

/**
 * Track menu item view
 */
export async function trackMenuItemView(menuItemId: string): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from("menu_item_views")
      .select("*")
      .eq("menu_item_id", menuItemId)
      .single();

    if (existing) {
      await supabase
        .from("menu_item_views")
        .update({
          view_count: existing.view_count + 1,
          last_viewed: new Date().toISOString(),
        })
        .eq("menu_item_id", menuItemId);
    } else {
      await supabase.from("menu_item_views").insert({
        menu_item_id: menuItemId,
        view_count: 1,
      });
    }
  } catch (error) {
    console.error("Error tracking menu item view:", error);
  }
}

/**
 * Get most viewed menu items
 */
export async function getMostViewedMenuItems(
  limit: number = 10
): Promise<MenuItemViewData[]> {
  const { data } = await supabase
    .from("menu_item_views")
    .select(`
      *,
      menu_items (
        nama_produk,
        kategori,
        harga,
        image_url
      )
    `)
    .order("view_count", { ascending: false })
    .limit(limit);
  return data || [];
}

/**
 * Get best selling menu items (by order count)
 */
export async function getBestSellingItems(
  limit: number = 10
): Promise<MenuItemOrderStats[]> {
  try {
    const { data, error } = await supabase
      .from("menu_item_order_stats")
      .select("*")
      .order("total_ordered", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching best selling items:", error);
    return [];
  }
}