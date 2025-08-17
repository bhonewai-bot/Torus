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

export interface UpdateProductDto extends Partial<CreateProductDto> {};