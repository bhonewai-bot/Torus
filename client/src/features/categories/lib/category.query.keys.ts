export const categoryKeys = {
    all: ["categories"] as const,
    lists: () => [...categoryKeys.all, "lists"] as const,
    list: () => [...categoryKeys.lists()] as const,
    details: (id: string) => [...categoryKeys.all, "details"] as const,
    detail: (id: string) => [...categoryKeys.details(), id] as const,
} as const;