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

// === TIPE DATA DARI SUPABASE ===
type MenuRow = {
    id: string; // uuid
    nama_produk: string;
    kategori: string;
    harga: number | string; // numeric -> biasanya datang sebagai string
    image_url: string | null;
    keterangan: string | null;
    created_at: string | null;
};

// === TIPE ITEM CART ===
type CartItem = {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    quantity: number;
};

// icon default per kategori
const CATEGORY_ICONS: Record<string, string> = {
    Makanan: "🍛",
    Minuman: "🥤",
    Snack: "🍟",
    Dessert: "🍰",
};

export default function FoodOrderApp() {
    // ====== STATE MENU (SUPABASE) ======
    const [menuItems, setMenuItems] = useState<MenuRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ====== STATE UI ======
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [language, setLanguage] = useState<"id" | "en">("id");

    // ====== STATE CART ======
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Ambil data menu dari Supabase
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

    // ====== KATEGORI (dari DB) ======
    const categories = useMemo(() => {
        const unique = Array.from(new Set(menuItems.map((m) => m.kategori)));
        return ["Semua", ...unique];
    }, [menuItems]);

    // ====== FILTER MENU (kategori + search) ======
    const filteredMenu = useMemo(() => {
        let list = [...menuItems];

        if (activeCategory) {
            list = list.filter((m) => m.kategori === activeCategory);
        }

        const term = search.trim().toLowerCase();
        if (term) {
            list = list.filter((m) =>
                m.nama_produk.toLowerCase().includes(term)
            );
        }

        return list;
    }, [menuItems, activeCategory, search]);

    // Popular dish: ambil maksimal 8 item
    const popularDishes = useMemo(
        () => filteredMenu.slice(0, 8),
        [filteredMenu]
    );

    // ====== HANDLER CART ======
    const handleAddToCart = (menu: MenuRow) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === menu.id);
            const price = Number(menu.harga) || 0;

            if (existing) {
                return prev.map((item) =>
                    item.id === menu.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [
                ...prev,
                {
                    id: menu.id,
                    name: menu.nama_produk,
                    price,
                    image_url: menu.image_url,
                    quantity: 1,
                },
            ];
        });
    };

    const handleCartIncrement = (id: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const handleCartDecrement = (id: string) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleCartQuantityChange = (id: string, value: string) => {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed <= 0) return;

        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: parsed } : item
            )
        );
    };

    // ====== HITUNG TOTAL CART ======
    const cartCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const discountPercent = 10;
    const discountAmount = (subtotal * discountPercent) / 100;
    const final = subtotal - discountAmount;

    return (
        <div className="min-h-screen bg-[#DCD7C9] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ================= MAIN CONTENT ================= */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            {/* Garis 3: language menu / profile */}
                            <div className="relative">
                                <Button
                                    className="bg-[#A27B5C] hover:bg-[#8d6a4d] text-white w-12 h-12"
                                    onClick={() => setShowLanguageMenu((prev) => !prev)}
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
                                {cartCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 bg-[#2C3930] text-white rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs">
                                        {cartCount}
                                    </Badge>
                                )}
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

                        {/* Categories (dinamis dari DB) */}
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

                        {/* Popular Dish */}
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
                                        const featured = idx === 0; // buat contoh, item pertama highlight
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
                                                                <span className="text-4xl">🍽️</span>
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
                                                            Rp{" "}
                                                            {Number(item.harga).toLocaleString("id-ID")}
                                                        </span>
                                                        <Button
                                                            size="icon"
                                                            onClick={() => handleAddToCart(item)}
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

                    {/* ================= CART SIDEBAR ================= */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6 bg-white shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold">My cart</h3>
                                    <Button variant="ghost" size="icon">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* List item cart */}
                                <div className="space-y-4 mb-6">
                                    {cartItems.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            {language === "id"
                                                ? "Keranjang masih kosong."
                                                : "Your cart is empty."}
                                        </p>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    {item.image_url ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-2xl">🍽️</span>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex flex-col gap-0.5 text-sm">
                                                        <span className="text-gray-700 line-clamp-1">
                                                            {item.name}
                                                        </span>
                                                        <div className="text-xs text-gray-500">
                                                            Rp{" "}
                                                            {item.price.toLocaleString("id-ID")} x{" "}
                                                            {item.quantity}
                                                        </div>
                                                        <div className="text-black font-semibold">
                                                            Rp{" "}
                                                            {(
                                                                item.price * item.quantity
                                                            ).toLocaleString("id-ID")}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 rounded-md">
                                                    <Button
                                                        size="icon"
                                                        className="w-7 h-7 rounded-full bg-[#A27B5C] text-white hover:bg-[#8d6a4d]"
                                                        onClick={() => handleCartDecrement(item.id)}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>

                                                    <Input
                                                        type="number"
                                                        className="
                              w-12 text-center
                              [&::-webkit-inner-spin-button]:appearance-none
                              [&::-webkit-outer-spin-button]:appearance-none
                              [-moz-appearance:textfield]
                            "
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleCartQuantityChange(
                                                                item.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    <Button
                                                        size="icon"
                                                        className="w-7 h-7 rounded-full bg-[#A27B5C] text-white hover:bg-[#8d6a4d]"
                                                        onClick={() => handleCartIncrement(item.id)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="border-t pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">
                                            Rp {subtotal.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Discount ({discountPercent}%)
                                        </span>
                                        <span className="text-[#2C3930] font-medium">
                                            - Rp {discountAmount.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <span className="font-semibold">Final</span>
                                        <span className="text-2xl font-bold text-[#A27B5C]">
                                            Rp {final.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    disabled={cartItems.length === 0}
                                    className="w-full mt-6 bg-[#2C3930] hover:bg-[#3F4F44] text-white py-4 text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Checkout
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
