"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  Upload,
  X,
  ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
};

type ProductFormData = {
  name: string;
  category: string;
  price: string;
  description: string;
  image: File | null;
  imagePreview: string;
};

const CATEGORIES = ["Makanan", "Minuman", "Snack", "Dessert"] as const;

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    price: "",
    description: "",
    image: null,
    imagePreview: "",
  });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: Product[] = (data || []).map((item) => ({
        id: item.id || item.id,
        name: item.nama_produk || "",
        category: item.kategori || "",
        price: Number(item.harga) || 0,
        image: item.image_url || "🍽️",
        description: item.keterangan || "",
      }));

      setProducts(formatted);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    try {
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

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("menu-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(
        error instanceof Error ? error.message : "Gagal upload gambar"
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      image: null,
      imagePreview: "",
    });
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description || "",
      image: null,
      imagePreview: product.image.startsWith("http") ? product.image : "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.imagePreview;

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const productData = {
        nama_produk: formData.name.trim(),
        kategori: formData.category,
        harga: parseFloat(formData.price),
        keterangan: formData.description.trim(),
        image_url: imageUrl || null,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("menu_items")
          .update(productData)
          .eq("id", editingProduct.id.trim());

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert([productData]);

        if (error) throw error;
      }

      await fetchProducts();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert(err instanceof Error ? err.message : "Gagal menyimpan produk");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id.trim());

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err instanceof Error ? err.message : "Gagal menghapus produk");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9B6A]" />
        <p className="text-gray-500">Memuat produk...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Products Management
          </h2>
          <p className="text-gray-500 mt-1">
            Kelola menu dan produk restoran Anda
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-[#FF9B6A] hover:bg-[#FF8A55] rounded-xl"
        >
          <Plus size={20} className="mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-start gap-2">
          <span className="text-red-500">⚠️</span>
          <div>
            <p className="font-semibold">Terjadi Kesalahan</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Product Table */}
      <Card className="bg-white border shadow-sm">
        <div className="p-6 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl">Daftar Produk</h3>
            <span className="text-sm text-gray-500">
              {products.length} produk tersedia
            </span>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Cari produk berdasarkan nama..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                {searchQuery ? "Produk tidak ditemukan" : "Belum ada produk"}
              </p>
              <p className="text-sm mt-1">
                {searchQuery
                  ? "Coba kata kunci lain"
                  : "Klik tombol 'Tambah Produk' untuk memulai"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Produk
                    </th>
                    <th className="text-center p-4 font-semibold text-gray-700">
                      Keterangan
                    </th>
                    <th className="text-center p-4 font-semibold text-gray-700">
                      Harga
                    </th>
                    <th className="text-center p-4 font-semibold text-gray-700">
                      Kategori
                    </th>
                    <th className="text-center p-4 font-semibold text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.image.startsWith("http") ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm border"
                              onClick={() => setPreviewImage(product.image)}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg text-2xl">
                              {product.image}
                            </div>
                          )}
                          <span className="font-medium text-gray-800">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-center text-gray-600 max-w-xs truncate">
                        {product.description || "-"}
                      </td>

                      <td className="p-4 font-semibold text-center text-gray-800">
                        {formatPrice(product.price)}
                      </td>

                      <td className="p-4 text-center">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {product.category}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(product)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                            onClick={() => setDeleteConfirm(product.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
      >
        <DialogContent className="max-w-4xl p-2 bg-black/90 border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview Gambar</DialogTitle>
            <DialogDescription>
              Preview gambar produk dalam ukuran penuh
            </DialogDescription>
          </DialogHeader>
          <div className="relative flex items-center justify-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[90vh] rounded-lg object-contain"
              />
            )}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Perbarui informasi produk di bawah ini"
                : "Isi formulir untuk menambahkan produk baru"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gambar Produk</Label>
              {formData.imagePreview ? (
                <div className="relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden group">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        image: null,
                        imagePreview: "",
                      }))
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Klik untuk upload gambar
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG hingga 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                placeholder="Contoh: Nasi Goreng Spesial"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                required
                placeholder="25000"
                min="0"
                step="1000"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Keterangan</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Deskripsi produk (opsional)"
                rows={3}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                disabled={uploading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#FF9B6A] hover:bg-[#FF8A55]"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {formData.image ? "Mengupload..." : "Menyimpan..."}
                  </>
                ) : editingProduct ? (
                  "Update Produk"
                ) : (
                  "Tambah Produk"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara
              permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteConfirm && handleDeleteProduct(deleteConfirm)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
