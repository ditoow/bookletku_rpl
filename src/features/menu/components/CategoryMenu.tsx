"use client";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CATEGORY_ICONS } from "@/shared/lib/categoryIcons";
import { Check } from "lucide-react";

interface CategoryMenuProps {
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  theme: "minimalist" | "colorful";
  language: "id" | "en";
}

export default function CategoryMenu({
  categories,
  activeCategory,
  setActiveCategory,
  theme,
  language,
}: CategoryMenuProps) {
  const activeBgClass =
    theme === "minimalist"
      ? "bg-gradient-to-br from-[#A27B5C] to-[#8d6a4d] border-[#A27B5C] shadow-lg shadow-[#A27B5C]/30"
      : "bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 border-pink-500 shadow-lg shadow-pink-500/40";

  const inactiveBgClass =
    theme === "minimalist"
      ? "bg-gradient-to-br from-[#F5F5F0] to-[#E8E4DD] border-gray-200/50 hover:border-[#A27B5C]/40"
      : "bg-gradient-to-br from-purple-50/80 to-pink-50/80 border-purple-200/50 hover:border-pink-300/60";

  const hoverScaleClass = "hover:scale-105 hover:-translate-y-1";

  const translateCategory = (cat: string) => {
    if (language === "id") return cat;

    const map: Record<string, string> = {
      Semua: "All",
      Makanan: "Food",
      Minuman: "Drinks",
      Snack: "Snacks",
      Dessert: "Desserts",
    };
    return map[cat] || cat;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {language === "id" ? "Kategori" : "Categories"}
        </h3>
        <div className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-full">
          {categories.length} {language === "id" ? "kategori" : "categories"}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((name: string) => {
          const isAll = name === "Semua";
          const isActive =
            (isAll && activeCategory === null) ||
            (!isAll && activeCategory === name);
          const icon = isAll ? "📋" : CATEGORY_ICONS[name] ?? "🥗";

          return (
            <Card
              key={name}
              className={`
                cursor-pointer 
                transition-all duration-300 ease-out
                min-w-[110px] shrink-0 
                md:min-w-0 md:w-auto
                border-2
                relative
                group
                ${isActive ? activeBgClass : inactiveBgClass}
                ${!isActive && hoverScaleClass}
              `}
              onClick={() => setActiveCategory(isAll ? null : name)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full relative">
                {/* Checkmark indicator untuk active state */}
                {isActive && (
                  <div className="absolute top-1.5 right-1.5 bg-white/30 backdrop-blur-sm rounded-full p-0.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                {/* Icon dengan hover animation */}
                <div
                  className={`
                  text-4xl mb-2.5
                  transition-transform duration-300
                  ${isActive ? "scale-110" : "group-hover:scale-125"}
                `}
                >
                  {icon}
                </div>

                {/* Category name */}
                <div
                  className={`
                    text-sm font-bold whitespace-nowrap
                    transition-colors duration-200
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-700 group-hover:text-gray-900"
                    }
                  `}
                >
                  {translateCategory(name)}
                </div>

                {/* Subtle glow effect untuk active */}
                {isActive && (
                  <div
                    className={`
                    absolute inset-0 rounded-xl opacity-50
                    ${
                      theme === "minimalist"
                        ? "bg-gradient-to-t from-[#A27B5C]/20 to-transparent"
                        : "bg-gradient-to-t from-pink-600/20 to-transparent"
                    }
                  `}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
