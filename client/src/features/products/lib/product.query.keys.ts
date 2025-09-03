import {ProductFilters} from "@/features/products/types/product.types";

export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "lists"] as const,
    list: (filters?: ProductFilters) => [...productKeys.lists(), { filters }] as const,
    details: () => [...productKeys.all, "details"] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
} as const;