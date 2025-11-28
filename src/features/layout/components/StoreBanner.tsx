"use client";

import { Card, CardContent } from "@/shared/components/ui/card";

export default function StoreBanner({
  totalItems,
  totalCategories,
  theme,
  language,
}: {
  totalItems: number;
  totalCategories: number;
  theme: "minimalist" | "colorful";
  language: "id" | "en";
}) {
  const bgClass =
    theme === "minimalist"
      ? "bg-linear-to-r from-[#2C3930] via-[#3F4F44] to-[#2C3930]"
      : "bg-gradient-to-r from-violet-600 to-indigo-600";

  const accentTextClass =
    theme === "minimalist" ? "text-[#A27B5C]" : "text-yellow-300";
  const iconBgClass =
    theme === "minimalist" ? "bg-[#A27B5C]" : "bg-white/20 backdrop-blur-sm";

  const text = {
    desc:
      language === "id"
        ? "Menu makanan segar & sehat"
        : "Fresh & healthy food menu",
    itemLabel: language === "id" ? "Total item" : "Total items",
    catLabel: language === "id" ? "Kategori" : "Categories",
  };

  return (
    <Card
      className={`${bgClass} text-white border-0 overflow-hidden transition-all duration-500`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`${iconBgClass} rounded-full w-16 h-16 flex items-center justify-center transition-colors`}
            >
              <img src="/icon.png" alt="Logo" className="" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">BookletKu</h2>
              <p className="text-[#DCD7C9] text-sm">{text.desc}</p>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <div className={`text-3xl font-bold ${accentTextClass}`}>
                {totalItems.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-[#DCD7C9]">{text.itemLabel}</div>
            </div>

            <div className="text-center">
              <div className={`text-3xl font-bold ${accentTextClass}`}>
                {totalCategories.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-[#DCD7C9]">{text.catLabel}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
