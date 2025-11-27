import { supabase } from "@/lib/supabase";

export const createOrder = async (totalAmount: number) => {
  const { data, error } = await supabase
    .from("orders")
    .insert({ total_amount: totalAmount, status: "completed" })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createOrderItems = async (items: any[], orderId: string) => {
  const orderItemsData = items.map((item) => ({
    order_id: orderId,
    menu_item_id: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error } = await supabase.from("order_items").insert(orderItemsData);
  if (error) throw error;
};