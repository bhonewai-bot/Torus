import {OrderFilters} from "@/features/orders/types/order.types";

export const orderKeys = {
    all: ["orders"] as const,
    lists: () => [...orderKeys.all, "lists"] as const,
    list: (filters?: OrderFilters) => [...orderKeys.lists(), {filters}] as const,
    details: () => [...orderKeys.all, "details"] as const,
    detail: (id: string) => [...orderKeys.details(), id] as const,
} as const;