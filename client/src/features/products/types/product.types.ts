interface CategoryInfo {
    id: string;
    title: string;
}

export interface Product {
    id: string;
    sku: string;
    title: string;
    brand?: string;
    description?: string;
    price: number;
    quantity: number;
    mainImage: string;
    category?: CategoryInfo;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductDetails extends Product {
    dimensions?: {
        length: number;
        width: number;
        height: number;
        weight: number;
    },
    pricing: {
        price: number;
        regularPrice?: number;
        salePrice?: number;
        taxRate?: number;
        taxIncluded?: boolean;
    },
    inventory: {
        quantity: number;
    },
    images: Array<{
        id: string;
        url: string;
        isMain: boolean;
    }>;
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
    products: Product[];
    pagination: Pagination;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    brand?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface CreateProductImageDto {
    url: string;
    isMain: boolean;
}

export interface CreateProductDto {
    sku: string;
    title: string;
    brand?: string;
    description?: string;
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    price: number;
    salePrice?: number;
    regularPrice?: number;
    taxRate?: number;
    taxIncluded?: boolean;
    quantity?: number;
    categoryId?: string;
    images?: CreateProductImageDto[],
    isActive?: boolean,
}