import {OrderStatus, PaymentMethod, PaymentStatus, ProductStatus} from "@prisma/client";
import { UserList } from "./user.types";
import { ShippingAddress } from "./address.types";
import { Payment } from "./payment.type";

export interface OrderItem {
    id: string;
    productId: string;
    productSku: string;
    productTitle: string;
    productImage?: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    product: {
        id: string;
        sku: string;
        title: string;
        price: number;
        status: ProductStatus;
    }
}

export interface OrderList {
    id: string;
    orderNumber: string;
    total: number;
    orderStatus: OrderStatus;
    user: UserList;
    createdAt: string;
    updatedAt: string;
}

export interface OrderDetail {
    id: string;
    orderNumber: string;
    orderStatus: OrderStatus;
    user: UserList;
    items: OrderItem[];
    pricing: {
        subtotal: number;
        taxAmount: number;
        shippingAmount: number;
        discountAmount: number;
        total: number;
    };
    shippingAddress?: ShippingAddress;
    payments: Payment[];
    createdAt: string;
    updatedAt: string;
}