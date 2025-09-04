export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";

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
    user: {
        id: string;
        name: string;
        email: string;
    },
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
    user: {
        id: string;
        name: string;
        email: string;
    },
    items: OrderItem[];
    itemCount: number;
    totalQuantity?: number;
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
    paymentStatus?: PaymentStatus;
    orderStatus?: OrderStatus;
    userId?: string;
    search?: string;
    sortBy?: "total" | "subtotal" | "paymentStatus" | "orderStatus" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}