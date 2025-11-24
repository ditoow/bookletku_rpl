"use client"

import React, { useState } from "react"
import type { MenuItem } from "@/lib/DummyMenu"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QuantityStepper from "@/components/components/QuantityStepper"

export default function MenuCard({
    item,
    language = "id",
}: {
    item: MenuItem
    language?: "id" | "en"
}) {
    const [qty, setQty] = useState(1)

    const name = language === "id" ? item.name_id : item.name_en
    const priceText =
        typeof item.price === "number"
            ? `Rp ${item.price.toLocaleString("id-ID")}`
            : "-"

    return (
        <Card className="rounded-xl overflow-hidden flex flex-col">
            {/* Image */}
            <div className="h-28 bg-gray-100 flex items-center justify-center">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-xs text-gray-400">No photo</div>
                )}
            </div>

            {/* Content */}
            <div className="p-3 flex-1 flex flex-col gap-1">
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-gray-500">{priceText}</div>

                {/* Footer */}
                <div className="mt-3 flex flex-col items-center gap-2">
                    <div className="scale-90">
                        <QuantityStepper value={qty} onChange={setQty} />
                    </div>

                    <Button
                        type="button"
                        className="w-full rounded-full text-xs"
                        variant="secondary"
                    >
                        Add to Dish
                    </Button>
                </div>
            </div>
        </Card>
    )
}
