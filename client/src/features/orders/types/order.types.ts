import { ProductStatus } from "@/features/products/types/product.types";

export const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Payment {
    id: string;
    method: string; // CREDIT_CARD, PAYPAL, etc.
    provider: string;
    transactionId?: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ShippingAddress {
    id: string;
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

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
        mainImage?: string;
    }
}

export interface OrderList {
    id: string;
    orderNumber: string;
    total: number;
    orderStatus: OrderStatus;
    user: {
        id: string;
        name: string;
        email: string;
    },
    createdAt: string;
    updatedAt: string;
}

export interface OrderDetail {
    id: string;
    orderNumber: string;
    orderStatus: OrderStatus;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    },
    items: OrderItem[];
    pricing: {
        subtotal: number;
        taxAmount: number;
        shippingAmount: number;
        discountAmount: number;
        total: number;
    };
    shippingAddress?: ShippingAddress;
    payments?: Payment[];
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface OrderResponse {
    orders: OrderList[];
    pagination: Pagination;
}

export interface OrderFilters {
    page?: number;
    limit?: number;
    orderStatus?: OrderStatus;
    userId?: string;
    search?: string;
    sortBy?: "total" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}