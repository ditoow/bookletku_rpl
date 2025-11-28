"use client";
import MenuDish from "./MenuDish";

interface MenuSectionProps {
  loading: boolean;
  error: string | null;
  language: "id" | "en";
  items: any[];
  onAdd: (item: any) => void;
  theme: "minimalist" | "colorful";
}

export default function MenuSection({
  loading,
  error,
  language,
  items,
  onAdd,
  theme,
}: MenuSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        {language === "id" ? "Menu" : "Menu"}
      </h3>
      {loading ? (
        <div className="text-sm text-gray-500">
          {language === "id" ? "Memuat..." : "Loading..."}
        </div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <MenuDish items={items} onAdd={onAdd} theme={theme} />
      )}
    </div>
  );
}
