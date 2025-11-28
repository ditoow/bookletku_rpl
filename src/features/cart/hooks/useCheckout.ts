
import { useState } from "react";
import { createOrder, createOrderItems } from "@/features/admin/services/orderServices";

export function useCheckout(cartItems: any[], setCartItems: (items: any[]) => void, setIsCartOpen: (open: boolean) => void) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckoutClick = () => {
    if (cartItems.length > 0) setIsConfirmOpen(true);
  };

  const processCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      const order = await createOrder(totalAmount);
      await createOrderItems(cartItems, order.id);

      // Logic WA
      const phoneNumber = "6281226821148"; // Nomor Admin
      let message = `*Pesanan Baru #${order.id.slice(0, 8)}*\n\n`;
      message += `*Detail Pesanan:*\n`;
      cartItems.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.name} (${item.quantity}x) @ Rp ${item.price.toLocaleString("id-ID")} = Rp ${itemTotal.toLocaleString("id-ID")}\n`;
      });
      message += `\n*Total Akhir: Rp ${totalAmount.toLocaleString("id-ID")}*`;
      message += `\n\nMohon diproses, terima kasih!`;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      setCartItems([]);
      setIsCartOpen(false);
      setIsConfirmOpen(false);
    } catch (e: any) {
      alert("Gagal memproses pesanan: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isConfirmOpen,
    setIsConfirmOpen,
    isProcessing,
    handleCheckoutClick,
    processCheckout,
  };
}