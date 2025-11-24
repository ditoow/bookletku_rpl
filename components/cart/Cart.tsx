"use client";

import React, { useState } from "react";
import { Edit2, Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// === TIPE ITEM CART ===
type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

export default function CartSidebar() {
  // ====== STATE CART ======
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleCartIncrement = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleCartDecrement = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountPercent = 10;
  const discountAmount = (subtotal * discountPercent) / 100;
  const final = subtotal - discountAmount;

  return (
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
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
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
                      Rp {item.price.toLocaleString("id-ID")} x {item.quantity}
                    </div>
                    <div className="text-black font-semibold">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
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
                      handleCartQuantityChange(item.id, e.target.value)
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
            <span className="text-gray-600">Discount ({discountPercent}%)</span>
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
  );
}
