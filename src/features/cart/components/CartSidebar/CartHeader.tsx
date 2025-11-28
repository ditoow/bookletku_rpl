// Cart Sidebar Header Component
import { Button } from "@/shared/components/ui/button";
import { X, ShoppingBag, Sparkles } from "lucide-react";

interface CartHeaderProps {
    language: "id" | "en";
    theme: "minimalist" | "colorful";
    itemCount: number;
    onClose: () => void;
}

export function CartHeader({ language, theme, itemCount, onClose }: CartHeaderProps) {
    const priceColor = theme === "minimalist" ? "text-[#A27B5C]" : "text-pink-600";

    const headerGradient =
        theme === "minimalist"
            ? "bg-gradient-to-r from-[#A27B5C]/10 to-transparent"
            : "bg-gradient-to-r from-pink-100/50 via-purple-100/50 to-blue-100/50";

    const buttonClass =
        theme === "minimalist"
            ? "bg-gradient-to-r from-[#A27B5C] to-[#8d6a4d] hover:from-[#8d6a4d] hover:to-[#7a5a3e]"
            : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600";

    const title = language === "id" ? "Keranjang" : "Cart";

    return (
        <div className={`${headerGradient} p-6 pb-4 border-b`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`${priceColor} bg-white p-2 rounded-full shadow-md`}>
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {title}
                    </h3>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:rotate-90 rounded-full"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Item count badge */}
            {itemCount > 0 && (
                <div className="flex items-center gap-2 mt-2">
                    <div className={`${buttonClass} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse shadow-md`}>
                        <Sparkles className="w-3 h-3" />
                        <span>{itemCount} {language === "id" ? "item" : "items"}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
