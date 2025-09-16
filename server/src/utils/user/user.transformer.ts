import { User, UserDetail } from "@src/types/user.types";

export function formatUser(user: any): User {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    }
}

export function formatUserDetail(user: any): UserDetail {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? undefined,
        enabled: user.enabled,
        createdAt: user.createdAt.toISOString(),
    }
}