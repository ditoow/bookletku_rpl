// Shared TypeScript types for Order domain

export interface OrderItem {
    menuId: string;
    menuName: string;
    quantity: number;
    price: number;
}

export interface Order {
    id?: string;
    customerName: string;
    tableNumber: string;
    items: OrderItem[];
    totalAmount: number;
    status?: string;
    createdAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
