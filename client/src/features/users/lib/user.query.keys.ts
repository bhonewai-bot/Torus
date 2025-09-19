import { UserFilters } from "../types/user.types";

export const userKeys = {
    all: ["users"] as const,
    lists: () => [...userKeys.all, "lists"] as const,
    list: (filters: UserFilters) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, "details"] as const,
    detail: (id: string) => [...userKeys.details(), id] as const
} as const;