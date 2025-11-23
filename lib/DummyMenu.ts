// lib/dummyMenu.ts

export type MenuItem = {
    id: number;
    name_id: string;
    name_en: string;
    price: number;
    category: string;
    image_url?: string | null;
};

export const MOCK_ITEMS: MenuItem[] = [
    {
        id: 1,
        name_id: "Burger Deluxe",
        name_en: "Burger Deluxe",
        price: 59900,
        category: "Fast Food",
        image_url: null,
    },
    {
        id: 2,
        name_id: "Pepperoni Pizza",
        name_en: "Pepperoni Pizza",
        price: 85000,
        category: "Italian",
        image_url: null,
    },
    {
        id: 3,
        name_id: "French Fries",
        name_en: "French Fries",
        price: 30000,
        category: "Snack",
        image_url: null,
    },
    {
        id: 4,
        name_id: "Ice Cream",
        name_en: "Ice Cream",
        price: 20000,
        category: "Dessert",
        image_url: null,
    },
];
