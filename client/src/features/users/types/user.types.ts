import { OrderStatus } from "@/features/orders/types/order.types";

export const USER_ROLES = ["ADMIN", "USER"] as const;
export type UserRole = typeof USER_ROLES[number];

export const USER_STATUSES = ["ACTIVE", "BANNED"] as const;
export type UserStatus = typeof USER_STATUSES[number];

export interface Address {
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

export interface UserList {
    id: string;
    avatar?: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface UserDetail {
    id: string;
    avatar?: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    addresses: Address[];
    orders?: {
            id: string;
            orderNumber: string;
            total: number;
            orderStatus: OrderStatus;
            createdAt: string;
    }[];
}

export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}