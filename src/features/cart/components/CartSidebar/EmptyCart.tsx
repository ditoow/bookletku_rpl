// Empty Cart State Component
import { Button } from "@/shared/components/ui/button";

interface EmptyCartProps {
    language: "id" | "en";
    theme: "minimalist" | "colorful";
    onClose: () => void;
}

export function EmptyCart({ language, theme, onClose }: EmptyCartProps) {
    const buttonClass =
        theme === "minimalist"
            ? "bg-gradient-to-r from-[#A27B5C] to-[#8d6a4d] hover:from-[#8d6a4d] hover:to-[#7a5a3e]"
            : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600";

    const emptyText = language === "id" ? "Keranjang masih kosong" : "Cart is empty";
    const emptySubtext = language === "id"
        ? "Mulai tambahkan produk favorit Anda"
        : "Start adding your favorite products";
    const backText = language === "id" ? "Kembali Belanja" : "Continue Shopping";

    return (
        <div className="text-center text-gray-500 py-12 flex flex-col items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 blur-2xl opacity-20 animate-pulse"></div>
                <span className="text-6xl relative z-10">🛒</span>
            </div>
            <div>
                <p className="text-lg font-semibold text-gray-700">{emptyText}</p>
                <p className="text-sm text-gray-500 mt-1">{emptySubtext}</p>
            </div>
            <Button
                variant="outline"
                className={`mt-2 ${buttonClass} text-white border-none hover:shadow-lg transition-all duration-300 hover:scale-105`}
                onClick={onClose}
            >
                {backText}
            </Button>
        </div>
    );
}
