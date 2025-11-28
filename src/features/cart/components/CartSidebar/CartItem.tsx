// Individual Cart Item Component
import { Button } from "@/shared/components/ui/button";
import { Plus, Minus, Trash2, Star } from "lucide-react";
import type { CartItem as CartItemType } from "@/shared/types/cart.types";

interface CartItemProps {
    item: CartItemType;
    theme: "minimalist" | "colorful";
    onIncrement: () => void;
    onDecrement: () => void;
    onRemove: () => void;
    index: number;
}

export function CartItem({
    item,
    theme,
    onIncrement,
    onDecrement,
    onRemove,
    index,
}: CartItemProps) {
    const buttonClass =
        theme === "minimalist"
            ? "bg-gradient-to-r from-[#A27B5C] to-[#8d6a4d] hover:from-[#8d6a4d] hover:to-[#7a5a3e]"
            : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600";

    const priceColor = theme === "minimalist" ? "text-[#A27B5C]" : "text-pink-600";

    const iconColor = theme === "minimalist" ? "text-[#A27B5C]" : "text-pink-500";

    return (
        <div
            className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50 group animate-in fade-in-0 slide-in-from-right-5"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Product Image */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm ring-2 ring-gray-200 group-hover:ring-gray-300 transition-all duration-300">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        🍽️
                    </span>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-800 truncate font-semibold text-sm pr-2 group-hover:text-gray-900 transition-colors">
                        {item.name}
                    </span>
                    <button
                        onClick={onRemove}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all duration-300 hover:rotate-12 hover:scale-110"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                    {/* Price */}
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                            Total
                        </span>
                        <span
                            className={`text-sm font-bold ${priceColor} bg-gradient-to-r ${theme === "minimalist"
                                    ? "from-[#A27B5C] to-[#8d6a4d]"
                                    : "from-pink-600 to-rose-600"
                                } bg-clip-text text-transparent`}
                        >
                            Rp {(item.price * item.quantity).toLocaleString()}
                        </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-1 border shadow-sm">
                        <Button
                            size="icon"
                            className="w-7 h-7 rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-200 hover:shadow-md transition-all duration-300 hover:scale-110"
                            onClick={onDecrement}
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </Button>

                        <div className="w-10 h-7 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-800">{item.quantity}</span>
                        </div>

                        <Button
                            size="icon"
                            className={`w-7 h-7 rounded-md text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 ${buttonClass}`}
                            onClick={onIncrement}
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
