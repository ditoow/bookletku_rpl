"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

import FeaturedMenu from "@/components/mainpage/featuredMenu";
import Category from "@/components/mainpage/categoryMenu";
import MenuDish from "@/components/mainpage/menuDish";
import Header from "@/components/mainpage/header";
import StoreBanner from "@/components/mainpage/storeBanner";
import CartSidebar from "@/components/mainpage/cartSidebar";
import { CartMobile } from "@/components/cart/cartMobile";
import CartButton from "@/components/mainpage/CartButton";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

type MenuRow = {
  id: string;
  nama_produk: string;
  kategori: string;
  harga: number;
  image_url?: string;
  keterangan?: string;
  created_at?: string;
  position?: number;
};

export type ThemeType = "minimalist" | "colorful";

export default function FoodOrderApp() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [theme, setTheme] = useState<ThemeType>("minimalist");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const trackAddToCart = async (menuId: string) => {
    try {
      await supabase.from("cart_add_tracking").insert({ menu_item_id: menuId });
    } catch (err) {
      console.error("Tracking error:", err);
    }
  };

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("menu_items")
        .select("*")
        .order("position", { ascending: true })
        .order("created_at", { ascending: false });

      if (data) {
        const mappedData = data.map((item: any) => ({
          ...item,
          image_url: item.image_url ?? undefined,
          keterangan: item.keterangan ?? undefined,
        }));
        setMenuItems(mappedData as MenuRow[]);
      }
      setLoading(false);
    };
    loadMenu();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map((m) => m.kategori)));
    return ["Semua", ...unique];
  }, [menuItems]);

  const filteredMenu = useMemo(() => {
    let list = [...menuItems];
    if (activeCategory && activeCategory !== "Semua")
      list = list.filter((m) => m.kategori === activeCategory);
    if (search)
      list = list.filter((m) =>
        m.nama_produk.toLowerCase().includes(search.toLowerCase())
      );
    return list;
  }, [menuItems, activeCategory, search]);

  const menuDishes = useMemo(() => menuItems.slice(0, 5), [menuItems]);
  const popularDishes = useMemo(() => filteredMenu.slice(), [filteredMenu]);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  const handleCheckoutClick = () =>
    cartItems.length > 0 && setIsConfirmOpen(true);

  
  const processCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({ total_amount: totalAmount, status: "completed" })
        .select()
        .single();

      if (orderError) throw orderError;

      
      const orderItemsData = cartItems.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      
      const phoneNumber = "6281226821148"; 

      let message = `*Pesanan Baru #${orderData.id.slice(0, 8)}*\n\n`;
      message += `*Detail Pesanan:*\n`;

      cartItems.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.name} (${
          item.quantity
        }x) @ Rp ${item.price.toLocaleString(
          "id-ID"
        )} = Rp ${itemTotal.toLocaleString("id-ID")}\n`;
      });

      message += `\n*Total Akhir: Rp ${totalAmount.toLocaleString("id-ID")}*`;
      message += `\n\nMohon diproses, terima kasih!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https:

      
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

  const bgClass =
    theme === "minimalist"
      ? "bg-[#DCD7C9]"
      : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100";

  return (
    <div
      className={`min-h-screen p-4 md:p-6 transition-colors duration-500 ${bgClass}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <div className="w-full max-w-4xl space-y-6 mx-auto">
            <Header
              language={language}
              setLanguage={setLanguage}
              showLanguageMenu={showLanguageMenu}
              setShowLanguageMenu={setShowLanguageMenu}
              search={search}
              setSearch={setSearch}
              cartItems={cartItems}
              setCartItems={setCartItems}
              theme={theme}
              setTheme={setTheme}
            />

            <StoreBanner
              totalItems={menuItems.length}
              totalCategories={Math.max(categories.length - 1, 0)}
              theme={theme}
              language={language}
            />

            <FeaturedMenu
              items={menuDishes}
              loading={loading}
              error={error}
              language={language}
              theme={theme}
            />

            <Category
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              theme={theme}
              language={language}
            />

            <div className="pb-20 md:pb-0">
              <MenuSection
                loading={loading}
                error={error}
                language={language}
                items={popularDishes}
                onAdd={handleAdd}
                theme={theme}
              />
            </div>
          </div>

          <div className="hidden md:block w-full md:w-auto">
            <div className="sticky top-6">
              <CartSidebar
                cartItems={cartItems}
                setCartItems={setCartItems}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={handleCheckoutClick}
                theme={theme}
                language={language}
              />
            </div>
          </div>

          <div className="block md:hidden">
            <CartMobile
              cartItems={cartItems}
              setCartItems={setCartItems}
              onCheckout={processCheckout}
              theme={theme}
              language={language}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <CartButton
          totalItems={totalQuantity}
          onClick={() => setIsCartOpen((prev) => !prev)}
          theme={theme}
        />
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "id" ? "Konfirmasi Pesanan" : "Confirm Order"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "id"
                ? "Sudah yakin dengan pesanan anda?"
                : "Are you sure about your order?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              {language === "id" ? "Batal" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                processCheckout();
              }}
              className={`${
                theme === "colorful" ? "bg-purple-600" : "bg-green-600"
              } text-white`}
              disabled={isProcessing}
            >
              {isProcessing
                ? language === "id"
                  ? "Memproses..."
                  : "Processing..."
                : language === "id"
                ? "Pesan via Whatsapp"
                : "Order via Whatsapp"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MenuSection({ loading, error, language, items, onAdd, theme }: any) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        {language === "id" ? "Menu" : "Menu"}
      </h3>
      {loading ? (
        <div className="text-sm text-gray-500">
          {language === "id" ? "Memuat..." : "Loading..."}
        </div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <MenuDish items={items} onAdd={onAdd} theme={theme} />
      )}
    </div>
  );
}
