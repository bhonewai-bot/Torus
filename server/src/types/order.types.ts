import {OrderStatus} from "@prisma/client";

export interface OrderItemResponse {
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}

export interface OrderResponse {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    items: OrderItemResponse[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
}