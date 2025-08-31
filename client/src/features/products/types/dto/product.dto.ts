import {UpdateImage, UploadedImage} from "@/features/products/types/image.types";

export interface CreateProductDto {
    sku: string;
    title: string;
    brand?: string;
    description?: string;
    categoryId?: string;
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    price: number;
    salePrice?: number;
    regularPrice?: number;
    taxRate?: number;
    taxIncluded?: boolean;
    quantity: number;
    images?: UploadedImage[];
    isActive: boolean;
}

export interface UpdateProductDto {
    sku?: string;
    title?: string;
    brand?: string;
    description?: string;
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    price?: number;
    regularPrice?: number;
    salePrice?: number;
    taxRate?: number;
    taxIncluded?: boolean;
    quantity?: number;
    categoryId?: string;
    images?: UpdateImage[];
    isActive?: boolean;
}