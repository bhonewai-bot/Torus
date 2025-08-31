import {OrderStatus} from "@prisma/client";

export interface OrderItem {
    id: string;
    price: number;
    quantity: number;
    taxAmount?: number;
    product: {
        id: string;
        title: string;
        mainImage?: string;
    }
}

export interface Order {
    id: string;
    subtotal: number;
    taxAmount: number;
    total: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    items: OrderItem[];
}