import {OrderStatus, PaymentStatus} from "@prisma/client";

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface OrderItem {
    id: string;
    productSku: string;
    productTitle: string;
    productImage?: string;
    price: number;
    quantity: number;
    taxAmount?: number;
    lineTotal: number;
    product: {
        id: string;
        sku: string;
        title: string;
        price: number;
        isActive: boolean;
        mainImage?: string;
    }
}

export interface OrderList {
    id: string;
    orderNumber: string;
    subtotal: number;
    taxAmount?: number;
    total: number;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    createdAt: string;
    updatedAt: string;
    user: User;
    itemCount: number;
    notes?: string;
}

export interface OrderDetail {
    id: string;
    orderNumber: string;
    subtotal: number;
    taxAmount?: number;
    total: number;
    shippingAddress?: string;
    billingAddress?: string;
    notes?: string;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    createdAt: string;
    updatedAt: string;
    user: User;
    items: OrderItem[];
    itemCount: number;
    totalQuantity: number;
}