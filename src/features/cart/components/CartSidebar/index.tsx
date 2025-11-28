"use client";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CartHeader } from "./CartHeader";
import { EmptyCart } from "./EmptyCart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import type { CartItem as CartItemType } from "@/shared/types/cart.types";

interface CartSidebarProps {
    cartItems: CartItemType[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>;
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
    theme: "minimalist" | "colorful";
    language: "id" | "en";
}

export default function CartSidebar({
    cartItems,
    setCartItems,
    isOpen,
    onClose,
    onCheckout,
    theme,
    language,
}: CartSidebarProps) {
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleRemoveItem = (id: string) =>
        setCartItems((prev) => prev.filter((item) => item.id !== id));

    const handleIncrement = (id: string) =>
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );

    const handleDecrement = (id: string) =>
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );

    if (!isOpen) {
        return <div className="hidden"></div>;
    }

    return (
        <div className="shrink-0">
            <Card className="sticky p-0 top-6 w-full md:w-[400px] bg-white shadow-2xl border-2 border-gray-100 transition-all duration-300 hover:shadow-3xl overflow-hidden">
                <CartHeader
                    language={language}
                    theme={theme}
                    itemCount={totalQuantity}
                    onClose={onClose}
                />

                <CardContent className="p-6">
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
                        {cartItems.length === 0 ? (
                            <EmptyCart language={language} theme={theme} onClose={onClose} />
                        ) : (
                            cartItems.map((item, index) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    theme={theme}
                                    onIncrement={() => handleIncrement(item.id)}
                                    onDecrement={() => handleDecrement(item.id)}
                                    onRemove={() => handleRemoveItem(item.id)}
                                    index={index}
                                />
                            ))
                        )}
                    </div>

                    {/* Summary & Checkout */}
                    {cartItems.length > 0 && (
                        <CartSummary
                            subtotal={subtotal}
                            language={language}
                            theme={theme}
                            onCheckout={onCheckout}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
