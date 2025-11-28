// Featured Menu Header Component
import { Star, TrendingUp } from "lucide-react";

interface FeaturedHeaderProps {
    language: "id" | "en";
    theme: "minimalist" | "colorful";
    itemCount: number;
}

export function FeaturedHeader({ language, theme, itemCount }: FeaturedHeaderProps) {
    const headerBgClass =
        theme === "minimalist"
            ? "bg-gradient-to-r from-[#A27B5C]/10 to-transparent"
            : "bg-gradient-to-r from-pink-100/50 to-purple-100/50";

    const iconColor = theme === "minimalist" ? "text-[#A27B5C]" : "text-pink-500";

    return (
        <div className={`flex items-center justify-between mb-4 p-3 rounded-xl ${headerBgClass}`}>
            <div className="flex items-center gap-2">
                <div className={`${iconColor}`}>
                    <Star className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                    {language === "id" ? "Menu Unggulan" : "Featured Menu"}
                </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full border">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-bold text-gray-700">
                    {itemCount} {language === "id" ? "item" : "items"}
                </span>
            </div>
        </div>
    );
}
