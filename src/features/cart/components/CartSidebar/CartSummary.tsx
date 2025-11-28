// Cart Summary and Checkout Component
import { Button } from "@/shared/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface CartSummaryProps {
    subtotal: number;
    language: "id" | "en";
    theme: "minimalist" | "colorful";
    onCheckout: () => void;
}

export function CartSummary({ subtotal, language, theme, onCheckout }: CartSummaryProps) {
    const priceColor = theme === "minimalist" ? "text-[#A27B5C]" : "text-pink-600";

    const checkoutClass =
        theme === "minimalist"
            ? "bg-gradient-to-r from-[#2C3930] to-[#3F4F44] hover:from-[#3F4F44] hover:to-[#4a5e50]"
            : "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700";

    const checkoutText = language === "id" ? "Pesan" : "Checkout";

    return (
        <>
            {/* Total Summary */}
            <div className="border-t-2 border-dashed border-gray-200 pt-4 space-y-4 bg-gradient-to-b from-white to-gray-50/50 -mx-6 px-6 pb-2">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700 text-base">Subtotal</span>
                    <span className={`text-xl font-bold ${priceColor}`}>
                        Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                </div>
            </div>

            {/* Checkout Button */}
            <Button
                className={`w-full mt-4 text-white py-6 text-lg font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden group ${checkoutClass}`}
                onClick={onCheckout}
            >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative z-10 flex items-center justify-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    {checkoutText}
                </span>
            </Button>
        </>
    );
}
