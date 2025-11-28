import { useState } from "react";
import { trackAddToCart } from "@/features/menu/services/menuServices";

export function useCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAdd = async (item: any) => {
    setIsCartOpen(true);
    trackAddToCart(item.id);
    setCartItems((prev: any[]) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist)
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [
        ...prev,
        {
          id: item.id,
          name: item.nama_produk,
          price: item.harga,
          quantity: 1,
          image: item.image_url,
        },
      ];
    });
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    setCartItems,
    isCartOpen,
    setIsCartOpen,
    handleAdd,
    totalQuantity,
  };
}