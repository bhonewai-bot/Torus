import { Address, OrderStatus, UserRole, UserStatus } from '@prisma/client';

export interface UserList {
    id: string;
    avatar?: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
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

export interface UserFilter {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    sortBy?: "name" | "email" | "createdAt";
    sortOrder?: "asc" | "desc";
}