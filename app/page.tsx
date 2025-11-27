"use client";

import React, { useState } from "react";

import Header from "@/components/mainpage/header";
import StoreBanner from "@/components/mainpage/storeBanner";
import FeaturedMenu from "@/components/mainpage/featuredMenu";
import Category from "@/components/mainpage/categoryMenu";
import MenuSection from "@/components/mainpage/MenuSection";
import CartSidebar from "@/components/mainpage/cartSidebar";
import { CartMobile } from "@/components/cart/cartMobile";
import CartButton from "@/components/mainpage/CartButton";
import OrderConfirmationDialog from "@/components/mainpage/orderConfirmatin";

import { useMenuData } from "@/hooks/useMenuData";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";

export type ThemeType = "minimalist" | "colorful";

export default function FoodOrderApp() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [theme, setTheme] = useState<ThemeType>("minimalist");

  const { menuDishes, popularDishes, loading, error, categories } = useMenuData(
    search,
    activeCategory
  );

  const {
    cartItems,
    setCartItems,
    isCartOpen,
    setIsCartOpen,
    handleAdd,
    totalQuantity,
  } = useCart();

  const {
    isConfirmOpen,
    setIsConfirmOpen,
    isProcessing,
    handleCheckoutClick,
    processCheckout,
  } = useCheckout(cartItems, setCartItems, setIsCartOpen);

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
          {/* Bagian Kiri: Konten Utama */}
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
              totalItems={popularDishes.length}
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

          {/* Bagian Kanan: Sidebar Cart Desktop */}
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

          {/* Cart Mobile */}
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

      {/* Floating Button Mobile */}
      <div className="hidden md:block">
        <CartButton
          totalItems={totalQuantity}
          onClick={() => setIsCartOpen((prev) => !prev)}
          theme={theme}
        />
      </div>

      {/* Dialog Konfirmasi */}
      <OrderConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={processCheckout}
        isProcessing={isProcessing}
        language={language}
        theme={theme}
      />
    </div>
  );
}
