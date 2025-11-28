// Shared TypeScript types for Menu domain

export interface MenuItem {
    id: string;
    nama_produk: string;
    harga: number;
    deskripsi?: string;
    kategori: string;
    image_url?: string;
    tersedia: boolean;
}

export interface MenuCategory {
    id: string;
    nama: string;
    icon?: string;
}

export interface FeaturedMenuItem {
    id: string;
    nama_produk: string;
    image_url?: string;
}
