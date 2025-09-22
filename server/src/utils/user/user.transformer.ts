import { UserList, UserDetail } from "@src/types/user.types";

export function formatUserList(user: any): UserList {
    return {
        id: user.id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
    }
}

export function formatUserDetail(user: any): UserDetail {
    return {
        id: user.id,
        avatar: user.avatar ?? undefined,
        name: user.name,
        email: user.email,
        phone: user.phone ?? undefined,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : new Date().toISOString(),
        addresses: user.addresses,
        orders: user.orders
    }
}

export function formatUserRole(user: any) {
    return {
        id: user.id,
        role: user.role,
        updatedAt: user.updatedAt
    }
}

export function formatUserStatus(user: any) {
    return {
        id: user.id,
        status: user.status,
        updatedAt: user.updatedAt
    }
}