export interface InventoryTypes {
    id: string;
    product: {
        id: string;
        name: string;
        sku: string;
        price: number;
    };
    productId: string;
    quantity: number;
    updatedAt: Date;
}