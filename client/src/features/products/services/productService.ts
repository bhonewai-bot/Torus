import {CreateProductDto, Product} from "@/features/products/types/product.types";
import api from "@/lib/api/client";
import {API_ENDPOINTS} from "@/lib/api/endpoints";

export interface ProductResponse {
    products: Product[];
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

export const productService = {
    getProducts: async (filters: ProductFilters = {}): Promise<ProductResponse> => {
        try {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });

            const queryString = params.toString();
            const url = queryString
                ? `${API_ENDPOINTS.admin.products.list}?${queryString}`
                : API_ENDPOINTS.admin.products.list;

            const response = await api.get(url);
            return response.data.data || response.data || {
                products: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error("Failed to fetch products");
        }
    },

    getProduct: async (id: string): Promise<ProductResponse> => {
        try {
            if (!id) {
                throw new Error("Product ID is required");
            }
            const response = await api.get(API_ENDPOINTS.admin.products.get(id));
            return response.data.data || [];
        } catch (error) {
            console.error("Error fetching product:", error);
            throw new Error("Failed to fetch product");
        }
    },

    createProduct: async (data: CreateProductDto): Promise<Product> => {
        try {
            const response = await api.post(API_ENDPOINTS.admin.products.create, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error("Failed to create product");
        }
    },

    deleteProduct: async (id: string): Promise<void> => {
        try {
            if (!id) {
                throw new Error("Product ID is required");
            }
            await api.delete(API_ENDPOINTS.admin.products.delete(id));
        } catch (error) {
            console.error("Error deleting product:", error);
            throw new Error("Failed to delete product");
        }
    }
}