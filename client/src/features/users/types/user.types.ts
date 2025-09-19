export const USER_ROLES = ["ADMIN", "USER"] as const;
export type UserRole = typeof USER_ROLES[number];

export const USER_STATUSES = ["ACTIVE", "BANNED"] as const;
export type UserStatus = typeof USER_STATUSES[number];

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

export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}