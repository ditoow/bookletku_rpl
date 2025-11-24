"use client"

import React from "react"

export default function CategoryCard({
    label,
    count,
    active,
    onClick,
}: {
    label: string
    count: number
    active?: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`
        w-40 px-4 py-2 rounded-full border
        flex flex-col justify-center 
        text-left transition-all
        ${active
                    ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                    : "bg-white border-gray-300 text-black"
                }
      `}
        >
            <span className="text-sm font-semibold leading-tight">
                {label}
            </span>

            <span
                className={`text-xs leading-tight ${active ? "text-emerald-800" : "text-gray-500"
                    }`}
            >
                {count} {count === 1 ? "item" : "items"}
            </span>
        </button>
    )
}
