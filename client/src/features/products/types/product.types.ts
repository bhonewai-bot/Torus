export interface Product {
    id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    categories: string[];
    images?: string[];
    quantity: number
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductDto {
    name: string;
    sku: string;
    description?: string;
    price: number;
    categories: string[];
    images?: string[];
    quantity: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductsListResponse {
    products: Product;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}