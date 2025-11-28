import { supabase } from "@/shared/lib/supabase";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
};

export type ProductInput = {
  nama_produk: string;
  kategori: string;
  harga: number;
  keterangan: string;
  image_url: string | null;
};

// --- Fetch Data ---
export const getProducts = async (): Promise<Product[]> => {
  // Ambil data urut berdasarkan Position (Drag & Drop)
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("position", { ascending: true }) // <--- PRIMARY SORT
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((item) => ({
    id: item.id,
    name: item.nama_produk || "",
    category: item.kategori || "",
    price: Number(item.harga) || 0,
    image: item.image_url || "🍽️",
    description: item.keterangan || "",
  }));
};

// --- Update Order (FIXED) ---
export const updateMenuOrder = async (items: Product[]) => {
  // Mapping data agar SESUAI dengan nama kolom di Database Supabase
  // Kita WAJIB kirim ulang data lama (nama, harga, dll) agar tidak melanggar constraint NOT NULL
  const updates = items.map((item, index) => ({
    id: item.id,
    position: index, // Update posisi baru
    
    // Field lain wajib disertakan:
    nama_produk: item.name,
    kategori: item.category,
    harga: item.price,
    // Jika image masih default placeholder, kirim null, jika tidak kirim URL-nya
    image_url: item.image === "🍽️" ? null : item.image, 
    keterangan: item.description 
  }));

  const { error } = await supabase
    .from("menu_items")
    .upsert(updates, { onConflict: "id" });

  if (error) {
    console.error("Detail Error Supabase:", error.message, error.details);
    throw error;
  }
};

// --- Upload Image ---
export const uploadProductImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;
  const filePath = `product-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("menu-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("menu-images").getPublicUrl(filePath);

  return publicUrl;
};

// --- CRUD Lainnya ---
export const createProduct = async (product: ProductInput) => {
  const { error } = await supabase.from("menu_items").insert([product]);
  if (error) throw new Error(error.message);
};

export const updateProduct = async (id: string, product: ProductInput) => {
  const { error } = await supabase
    .from("menu_items")
    .update(product)
    .eq("id", id);
  if (error) throw new Error(error.message);
};

export const deleteProductById = async (id: string) => {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
};