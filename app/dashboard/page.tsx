"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  Plus,
  Edit2,
  Minus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

// Tipe baris dari tabel Supabase
type MenuRow = {
  id: string; // uuid
  nama_produk: string;
  kategori: string;
  harga: number;
  image_url: string | null;
  keterangan: string | null;
  created_at: string | null;
};

// icon default per kategori
const CATEGORY_ICONS: Record<string, string> = {
  Makanan: "🍛",
  Minuman: "🥤",
  Snack: "🍟",
  Dessert: "🍰",
};

export default function FoodOrderApp() {
  // ==== CART MASIH DUMMY (BOLEH DI-SUPABASE-IN NANTI) ====
  const [cartItems] = useState([
    {
      id: 1,
      name: "Crunchy Cashew ...",
      quantity: 2,
      price: 1500,
      image: "🥗",
    },
    { id: 2, name: "Coke", quantity: 3, price: 8000, image: "🥤" },
    { id: 3, name: "Steak meat", quantity: 1, price: 7655, image: "🥩" },
    { id: 4, name: "Pizza", quantity: 1, price: 15000, image: "🍕" },
  ]);

  // ==== DATA DARI SUPABASE ====
  const [menuItems, setMenuItems] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [language, setLanguage] = useState<"id" | "en">("id"); // buat teks UI aja

  // ambil data dari Supabase saat pertama kali render
  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
      } else if (data) {
        setMenuItems(data as MenuRow[]);
      }

      setLoading(false);
    };

    loadMenu();
  }, []);

  // daftar kategori: "Semua" + kategori unik dari DB
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(menuItems.map((m) => m.kategori)),
    );
    return ["Semua", ...unique];
  }, [menuItems]);

  // filter menu berdasarkan kategori + search
  const filteredMenu = useMemo(() => {
    let list = [...menuItems];

    if (activeCategory) {
      list = list.filter((m) => m.kategori === activeCategory);
    }

    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter((m) =>
        m.nama_produk.toLowerCase().includes(term),
      );
    }

    return list;
  }, [menuItems, activeCategory, search]);

  // popular dishes: ambil maksimal 8 item pertama dari hasil filter
  const popularDishes = useMemo(
    () => filteredMenu.slice(0, 8),
    [filteredMenu],
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = 10;
  const final = subtotal - discount;

  return (
    <div className="min-h-screen bg-[#DCD7C9] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              {/* Garis 3: bisa untuk language menu / profile */}
              <div className="relative">
                <Button
                  className="bg-[#A27B5C] hover:bg-[#8d6a4d] text-white w-12 h-12"
                  onClick={() =>
                    setShowLanguageMenu((prev) => !prev)
                  }
                >
                  <Menu className="w-5 h-5" />
                </Button>

                {showLanguageMenu && (
                  <div className="absolute left-0 mt-2 w-32 rounded-lg border bg-white text-gray-800 shadow-lg z-10">
                    <button
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${language === "id" ? "font-semibold" : ""
                        }`}
                      onClick={() => {
                        setLanguage("id");
                        setShowLanguageMenu(false);
                      }}
                    >
                      Indonesia
                    </button>
                    <button
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${language === "en" ? "font-semibold" : ""
                        }`}
                      onClick={() => {
                        setLanguage("en");
                        setShowLanguageMenu(false);
                      }}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={
                    language === "id"
                      ? "Cari produk..."
                      : "Search product here..."
                  }
                  className="pl-10 bg-white border-0 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Button variant="ghost" className="w-12 h-12">
                <span className="text-2xl">😋</span>
              </Button>
              <Button variant="ghost" className="w-12 h-12 relative">
                <ShoppingCart className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 bg-[#2C3930] text-white rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs">
                  12
                </Badge>
              </Button>
            </div>

            {/* Breadcrumb */}
            <div className="text-sm text-gray-600">
              Store <span className="mx-2">›</span>{" "}
              <span className="font-medium">Bell fresh</span>
            </div>

            {/* Store Banner */}
            <Card className="bg-gradient-to-r from-[#2C3930] via-[#3F4F44] to-[#2C3930] text-white border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#A27B5C] rounded-full w-16 h-16 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        Bell.
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Bell fresh</h2>
                      <p className="text-[#DCD7C9] text-sm">
                        Fresh &amp; healthy food recipe
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#A27B5C]">
                        {menuItems.length.toString().padStart(2, "0")}
                      </div>
                      <div className="text-sm text-[#DCD7C9]">
                        Total item
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#A27B5C]">
                        {Math.max(categories.length - 1, 0)
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className="text-sm text-[#DCD7C9]">
                        Category
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#A27B5C]">
                        00
                      </div>
                      <div className="text-sm text-[#DCD7C9]">
                        Outdate
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories (dari DB) */}
            <div className="grid grid-cols-6 gap-3">
              {categories.map((name) => {
                const isAll = name === "Semua";
                const isActive =
                  (isAll && activeCategory === null) ||
                  (!isAll && activeCategory === name);

                const icon = isAll
                  ? "📋"
                  : CATEGORY_ICONS[name] ?? "🥗";

                return (
                  <Card
                    key={name}
                    className={`cursor-pointer transition-all hover:shadow-md ${isActive
                        ? "bg-[#A27B5C] border-[#A27B5C]"
                        : "bg-white border-gray-200"
                      }`}
                    onClick={() =>
                      setActiveCategory(isAll ? null : name)
                    }
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{icon}</div>
                      <div
                        className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"
                          }`}
                      >
                        {name}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Popular Dish (pakai data Supabase) */}
            <div>
              <h3 className="text-xl font-bold mb-4">Popular Dish</h3>

              {loading ? (
                <div className="text-sm text-gray-500">
                  {language === "id"
                    ? "Memuat menu..."
                    : "Loading menu..."}
                </div>
              ) : error ? (
                <div className="text-sm text-red-600">
                  Error: {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {popularDishes.map((item, idx) => {
                    const featured = idx === 0; // pertama dijadikan featured
                    return (
                      <Card
                        key={item.id}
                        className={`overflow-hidden transition-all hover:shadow-lg ${featured
                            ? "bg-[#A27B5C] border-[#A27B5C]"
                            : "bg-white"
                          }`}
                      >
                        <CardContent className="p-4">
                          <div className="relative mb-3">
                            <div
                              className={`w-full aspect-square rounded-full ${featured
                                  ? "bg-[#8d6a4d]"
                                  : "bg-gray-100"
                                } flex items-center justify-center mb-3`}
                            >
                              {item.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.image_url}
                                  alt={item.nama_produk}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-4xl">
                                  🍽️
                                </span>
                              )}
                            </div>
                          </div>
                          <h4
                            className={`font-semibold mb-2 text-center ${featured
                                ? "text-white"
                                : "text-gray-800"
                              }`}
                          >
                            {item.nama_produk}
                          </h4>
                          <div
                            className={`text-xs text-center mb-3 line-clamp-2 ${featured
                                ? "text-white/90"
                                : "text-gray-500"
                              }`}
                          >
                            {item.keterangan || "Menu spesial kami"}
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xl font-bold ${featured
                                  ? "text-white"
                                  : "text-gray-800"
                                }`}
                            >
                              Rp {Number(item.harga).toLocaleString("id-ID")}
                            </span>
                            <Button
                              size="icon"
                              className={`rounded-full ${featured
                                  ? "bg-white text-[#A27B5C] hover:bg-gray-100"
                                  : "bg-[#A27B5C] text-white hover:bg-[#8d6a4d]"
                                }`}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar (masih dummy) */}
          <FoodOrderApp />;
        </div>
      </div>
    </div>
  );
}
