import { update } from "lodash";

export const API_ENDPOINTS = {
    // Admin endpoins
    admin: {
        products: {
            list: "/admin/products",
            create: "/admin/products",
            update: (id: string) => `/admin/products/${id}`,
            delete: (id: string) => `/admin/products/${id}`,
            get: (id: string) => `/admin/products/${id}`,
            bulkDelete: "/admin/products/bulk-delete",
        },
        images: {
            create: "/admin/uploads/images",
            delete: (filename: string) => `/admin/uploads/images/${filename}`,
        },
        categories: {
            list: "/admin/categories",
            create: "/admin/categories",
        },
        inventory: {
            get: "",
            update: (productId: string) => `/admin/inventory/${productId}`,
            bulkUpdate: "/admin/inventory/bulk-update"
        },
        orders: {
            list: "/admin/orders",
            get: (id: string) => `/admin/orders/${id}`,
            updateStatus: (id: string) => `/admin/orders/${id}/status`,
        },
        users: {
            list: "/admin/users",
            get: (id: string) => `/admin/users/${id}`,
            updateRole: (id: string) => `/admin/users/${id}/role`,
            updateStatus: (id: string) => `/admin/users/${id}/status`,
        },
    },
} as const;