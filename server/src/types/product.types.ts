import { ProductStatus } from "@prisma/client";
import {Category} from "@src/types/category.types";

export interface ProductImage {
    id: string;
    url: string;
    isMain: boolean;
}

// Core product interfaces
export interface ProductList {
    id: string;
    sku: string;
    title: string;
    price: number;
    quantity: number;
    mainImage?: string;
    category?: Category;
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ProductDetail {
    id: string;
    sku: string;
    title: string;
    description?: string;
    category?: Category;
    price: number;
    quantity: number;
    images: ProductImage[];
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
}