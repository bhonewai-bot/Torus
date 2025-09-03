export type OrderStatus = {
    status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELED"
}

export interface OrderItem {
    id: string;
    price: number;
    quantity: number;
    taxAmount?: number;
    product: Array<{
        id: string;
        title: string;
        mainImage?: string;
    }>
}

export interface Order {
    id: string;
    subtotal: string;
    taxAmount?: number;
    total: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    },
    items: OrderItem[];
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
    orders: Order[];
    pagination: Pagination;
}

export interface OrderFilters {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    userId?: string;
    search?: string;
    sortBy?: "total" | "subtotal" | "status" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}