export const API_ENDPOINTS = {
    // Admin endpoins
    admin: {
        products: {
            list: "/admin/products",
            create: "/admin/products",
            update: (id: string) => `/admin/products/${id}`,
            delete: (id: string) => `/admin/products/${id}`,
            get: (id: string) => `/admin/products/${id}`,
        },
        images: {
            create: "/admin/uploads/images",
            delete: (filename: string) => `/admin/uploads/images/${filename}`,
        },
        categories: {
            list: "/admin/categories",
        },
        inventory: {
            get: "",
            update: (productId: string) => `/admin/inventory/${productId}`,
            bulkUpdate: "/admin/inventory/bulk-update"
        },
        orders: {
            list: "/admin/orders",
            get: (id: string) => `/admin/orders/${id}`,
            update: (id: string) => `/admin/orders/${id}/status`,
        },
        users: {
            list: "/admin/users",
            get: (id: string) => `/admin/users/${id}`,
        },
    },
} as const;