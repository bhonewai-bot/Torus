export const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE", "DISCONTINUED"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

interface CategoryInfo {
    id: string;
    title: string;
}

export interface ProductList {
    id: string;
    sku: string;
    title: string;
    price: number;
    quantity: number;
    mainImage?: string;
    category?: CategoryInfo;
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ProductDetails {
    id: string;
    sku: string;
    title: string;
    brand?: string;
    description?: string;
    category?: CategoryInfo;
    pricing: {
        price: number;
    };
    images: Array<{
        id: string;
        url: string;
        isMain: boolean;
    }>;
    inventory: {
        quantity: number,
    },
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ProductListResponse {
    products: ProductList[];
    pagination: Pagination;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}