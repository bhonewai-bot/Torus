import {Category} from "@src/types/category.types";

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
export interface ProductList {
    id: string;
    sku: string;
    title: string;
    brand?: string;
    price: number;
    quantity: number;
    mainImage?: string;
    category?: Category;
    isActive: boolean;
}

export interface ProductDetail {
    id: string;
    sku: string;
    title: string;
    brand?: string;
    description?: string;
    category?: Category;
    dimensions: ProductDimensions;
    pricing: ProductPricing;
    inventory: ProductInventory;
    images: ProductImage[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}