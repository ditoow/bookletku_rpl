import { supabase } from "@/shared/lib/supabase";

export const fetchMenuItems = async () => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
};

export const trackAddToCart = async (menuId: string) => {
  const { error } = await supabase.from("cart_add_tracking").insert({ menu_item_id: menuId });
  if (error) console.error("Tracking error:", error);
};