"use client";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

interface MenuItem {
  id: string;
  nama_produk: string;
  keterangan?: string;
  harga: number;
  image_url?: string;
}

interface MenuDishProps {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
  theme: "minimalist" | "colorful";
}

export default function MenuDish({ items, onAdd, theme }: MenuDishProps) {
  const buttonClass =
    theme === "minimalist"
      ? "bg-[#A27B5C] hover:bg-[#8d6a4d] shadow-md hover:shadow-lg"
      : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-md hover:shadow-lg";

  const priceColor =
    theme === "minimalist"
      ? "text-[#A27B5C]"
      : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600";

  const cardHoverClass =
    theme === "minimalist"
      ? "hover:border-[#A27B5C]/30 hover:shadow-xl"
      : "hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-200/50";

  const imageBgClass =
    theme === "minimalist"
      ? "bg-gradient-to-br from-[#DCD7C9] to-[#C9C0B3]"
      : "bg-gradient-to-br from-purple-100/80 via-pink-100/80 to-blue-100/80";

  const priceBgClass =
    theme === "minimalist"
      ? "bg-gradient-to-r from-[#DCD7C9]/50 to-[#C9C0B3]/50"
      : "bg-gradient-to-r from-purple-100/60 to-pink-100/60";

  const cardBgClass =
    theme === "minimalist"
      ? "bg-gradient-to-br from-[#F5F5F0] to-[#E8E4DD]"
      : "bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-blue-50/80";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-0">
      {items.map((item, index) => (
        <Card
          key={item.id}
          className={`
            overflow-hidden p-0 
            transition-all duration-300 ease-out
            hover:-translate-y-1
            ${cardHoverClass}
            ${cardBgClass}
            h-full flex flex-col
            border-2
            group
          `}
        >
          <CardContent className="p-3 md:p-4 h-full">
            {/* ---------- MOBILE LAYOUT ---------- */}
            <div className="flex md:hidden items-center gap-4">
              <div
                className={`
                w-20 h-20 rounded-xl overflow-hidden 
                flex items-center justify-center
                ${imageBgClass}
                group-hover:scale-105 transition-transform duration-300
                shadow-sm
              `}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.nama_produk}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">🍽️</span>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <h4 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-gray-700">
                  {item.nama_produk}
                </h4>
                <span className={`text-base font-extrabold ${priceColor} mt-1`}>
                  Rp {Number(item.harga).toLocaleString("id-ID")}
                </span>
              </div>

              <Button
                size="icon"
                className={`
                  rounded-full text-white w-10 h-10 
                  transition-all duration-300
                  ${buttonClass}
                  hover:scale-110 active:scale-95
                `}
                onClick={() => onAdd(item)}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* ---------- DESKTOP LAYOUT ---------- */}
            <div className="hidden md:flex flex-col h-full justify-between gap-3">
              <div className="relative">
                <div
                  className={`
                  w-full aspect-square rounded-2xl 
                  flex items-center justify-center
                  ${imageBgClass}
                  overflow-hidden
                  shadow-md
                  group-hover:shadow-xl
                  transition-all duration-300
                `}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.nama_produk}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      🍽️
                    </span>
                  )}

                  {/* Badge Overlay untuk item index 0-2 */}
                  {index < 3 && theme === "colorful" && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Popular
                    </div>
                  )}
                </div>
              </div>

              <h4 className="font-bold text-base text-center text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors px-1">
                {item.nama_produk}
              </h4>

              <div className="text-xs text-center line-clamp-2 text-gray-500 px-2">
                {item.keterangan || "Menu spesial kami"}
              </div>

              <div
                className={`
                flex items-center justify-between gap-2 mt-auto
                p-3 rounded-xl
                ${priceBgClass}
              `}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-medium">
                    Harga
                  </span>
                  <span className={`text-lg font-black ${priceColor}`}>
                    Rp {Number(item.harga).toLocaleString("id-ID")}
                  </span>
                </div>

                <Button
                  size="icon"
                  className={`
                    rounded-full text-white w-11 h-11
                    transition-all duration-300
                    ${buttonClass}
                    hover:scale-110 hover:rotate-90 active:scale-95
                  `}
                  onClick={() => onAdd(item)}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
