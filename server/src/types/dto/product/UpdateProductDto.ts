export interface UpdateProductImageDto {
    url: string;
    isMain: boolean;
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
    images?: UpdateProductImageDto[];
    isActive?: boolean;
}