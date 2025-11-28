import { useState, useCallback, useEffect } from "react";
import { createProduct, deleteProductById, getProducts, Product, ProductInput, updateProduct, uploadProductImage } from "@/features/admin/services/productService";


export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (
    data: Omit<ProductInput, "image_url"> & { image: File | null; imagePreview: string }
  ) => {
    setActionLoading(true);
    try {
      let imageUrl = data.imagePreview;
      if (data.image) {
        imageUrl = await uploadProductImage(data.image);
      }

      await createProduct({
        nama_produk: data.nama_produk,
        kategori: data.kategori,
        harga: data.harga,
        keterangan: data.keterangan,
        image_url: imageUrl || null,
      });
      await fetchProducts();
    } finally {
      setActionLoading(false);
    }
  };

  const editProduct = async (
    id: string,
    data: Omit<ProductInput, "image_url"> & { image: File | null; imagePreview: string }
  ) => {
    setActionLoading(true);
    try {
      let imageUrl = data.imagePreview;
      // Jika ada file baru, upload. Jika tidak, pakai yang lama (imagePreview berisi URL lama)
      if (data.image) {
        imageUrl = await uploadProductImage(data.image);
      }

      await updateProduct(id, {
        nama_produk: data.nama_produk,
        kategori: data.kategori,
        harga: data.harga,
        keterangan: data.keterangan,
        image_url: imageUrl || null,
      });
      await fetchProducts();
    } finally {
      setActionLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    setActionLoading(true);
    try {
      await deleteProductById(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setActionLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    actionLoading,
    refetch: fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  };
}