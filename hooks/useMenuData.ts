import { useState, useEffect, useMemo } from "react";
import { fetchMenuItems } from "../services/menuServices";

export type MenuRow = {
  id: string;
  nama_produk: string;
  kategori: string;
  harga: number;
  image_url?: string;
  keterangan?: string;
  created_at?: string;
  position?: number;
};

export function useMenuData(search: string, activeCategory: string | null) {
  const [menuItems, setMenuItems] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMenuItems();
        if (data) {
             const mappedData = data.map((item: any) => ({
              ...item,
              image_url: item.image_url ?? undefined,
              keterangan: item.keterangan ?? undefined,
            }));
            setMenuItems(mappedData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(menuItems.map((m) => m.kategori)));
    return ["Semua", ...unique];
  }, [menuItems]);

  const filteredMenu = useMemo(() => {
    let list = [...menuItems];
    if (activeCategory && activeCategory !== "Semua")
      list = list.filter((m) => m.kategori === activeCategory);
    if (search)
      list = list.filter((m) =>
        m.nama_produk.toLowerCase().includes(search.toLowerCase())
      );
    return list;
  }, [menuItems, activeCategory, search]);

  const menuDishes = useMemo(() => menuItems.slice(0, 5), [menuItems]);
  const popularDishes = useMemo(() => filteredMenu.slice(), [filteredMenu]);

  return {
    menuItems,
    loading,
    error,
    categories,
    menuDishes,
    popularDishes,
  };
}