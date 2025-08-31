export interface CategoryInfo {
    id: string;
    title: string;
}

export interface ProductImage {
    id: string;
    url: string;
    isMain: boolean;
}

export interface ProductDimensions {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
}

export interface ProductPricing {
    price: number;
    regularPrice?: number;
    salePrice?: number;
    taxRate?: number;
    taxIncluded?: boolean;
}

export interface ProductInventory {
    quantity: number;
}

// Core product interfaces
export interface ProductListItem {
    id: string;
    sku: string;
    title: string;
    brand?: string;
    price: number;
    quantity: number;
    mainImage?: string;
    category?: CategoryInfo;
    isActive: boolean;
}

export interface ProductDetailItem {
    id: string;
    sku: string;
    title: string;
    brand?: string;
    description?: string;
    category?: CategoryInfo;
    dimensions: ProductDimensions;
    pricing: ProductPricing;
    inventory: ProductInventory;
    images: ProductImage[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}