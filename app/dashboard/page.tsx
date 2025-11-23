"use client"

import React, { useMemo, useState } from "react"
import { MOCK_ITEMS, MenuItem } from "@/lib/DummyMenu"
import CategoryCard from "@/components/components/CategoryCard"
import MenuCard from "@/components/components/MenuCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [items] = useState<MenuItem[]>(MOCK_ITEMS)
  const [language, setLanguage] = useState<"id" | "en">("id")
  const [q, setQ] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const set = new Set<string>()
    items.forEach((it) => set.add(it.category || "Lainnya"))
    return Array.from(set)
  }, [items])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return items.filter((it) => {
      const name = language === "id" ? it.name_id : it.name_en
      const matchCat = !activeCategory || it.category === activeCategory
      const matchQ = term === "" || name.toLowerCase().includes(term)
      return matchCat && matchQ
    })
  }, [items, q, activeCategory, language])

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Banner */}
        <div className="overflow-hidden rounded-xl border">
          <div className="flex items-center gap-6 p-4">

            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Selamat Pagi...</h1>
              <p className="text-sm text-gray-600">Selamat Datang di RM Kelompok 3</p>
            </div>

            <div className="w-80">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  language === "id"
                    ? "Cari produk..."
                    : "What do you want to eat today..."
                }
                className="rounded-full"
              />
            </div>

            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setLanguage((l) => (l === "id" ? "en" : "id"))}
            >
              {language === "id" ? "ID" : "EN"}
            </Button>
          </div>

          <div className="border-t p-4">
            <div className="flex h-36 items-center justify-center rounded-lg border-2 border-dashed text-sm text-gray-500">
              Banner area (belum ada foto)
            </div>
          </div>
        </div>

        {/* Category row */}
        <div className="flex gap-4 overflow-x-auto py-2">
          <CategoryCard
            label={language === "id" ? "Semua" : "All"}
            count={items.length}
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map((cat) => (
            <CategoryCard
              key={cat}
              label={cat}
              count={items.filter((i) => i.category === cat).length}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        {/* Menu grid */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">
            {activeCategory
              ? activeCategory
              : language === "id"
                ? "Semua Menu"
                : "All Menu"}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.length === 0 ? (
              <div className="col-span-full py-6 text-center text-gray-600">
                {language === "id" ? "Tidak ada item." : "No items."}
              </div>
            ) : (
              filtered.map((it) => (
                <MenuCard key={it.id} item={it} language={language} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
