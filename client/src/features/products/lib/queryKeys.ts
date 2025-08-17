export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "lists"] as const,
    list: (filters?: any) => [...productKeys.lists(), filters] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
} as const;