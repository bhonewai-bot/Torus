export interface ProductResponse {
    id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    categories: string[];
    images: string[];
    quantity: number
    createdAt: Date;
    updatedAt: Date;
}
