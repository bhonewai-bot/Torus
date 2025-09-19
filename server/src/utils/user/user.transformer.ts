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

/* export function formatUserDetail(user: any): UserDetail {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? undefined,
        enabled: user.enabled,
        createdAt: user.createdAt.toISOString(),
    }
} */