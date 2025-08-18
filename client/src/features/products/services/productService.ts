import {
    ApiResponse,
    CreateProductDto,
    Product,
    ProductFilters,
    ProductsListResponse,
    UpdateProductDto
} from "@/features/products/types/product.types";
import api from "@/lib/api/client";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import {ProductServiceError} from "@/features/products/lib/error";

class ProductService {
    private buildQueryString(filters: ProductFilters): string {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });

        return params.toString();
    }

    private handleApiError(error: unknown, context: string): never {
        console.error(`${context}:`, error);

        if (error instanceof Error) {
            // Handle specific API errors
            if ('response' in error && typeof error.response === 'object' && error.response) {
                const response = error.response as any;
                const message = response.data?.message || response.statusText || error.message;
                const statusCode = response.status;

                throw new ProductServiceError(message, statusCode, error);
            }
            throw new ProductServiceError(error.message, undefined, error);
        }

        throw new ProductServiceError(`Unknown error occurred in ${context}`, undefined, error);
    }

    async getProducts(filters: ProductFilters = {}): Promise<ProductsListResponse> {
        try {
            const queryString = this.buildQueryString(filters);
            const url = queryString
                ? `${API_ENDPOINTS.admin.products.list}?${queryString}`
                : API_ENDPOINTS.admin.products.list;

            const response = await api.get<ApiResponse<ProductsListResponse>>(url);

            const data = response.data.data || response.data;

            return {
                products: data || [],
                total: data?.total || 0,
                page: data?.page || 1,
                limit: data?.limit || 10,
                totalPages: data?.totalPages || 0,
            }
        } catch (error) {
            this.handleApiError(error, "Error fetching products");
        }
    }

    async getProduct(id: string): Promise<Product> {
        if (!id?.trim()) {
            throw new ProductServiceError("Product ID is required");
        }

        try {
            const response = await api.get<ApiResponse<Product>>(
                API_ENDPOINTS.admin.products.get(id)
            );

            const product = response.data.data || response.data;

            if (!product) {
                throw new ProductServiceError("Product not found", 404);
            }

            return product;
        } catch (error) {
            this.handleApiError(error, "Error fetching product");
        }
    }

    async createProduct(data: CreateProductDto): Promise<Product> {
        // Basic validation
        if (!data.name) {
            throw new ProductServiceError("Product name is required");
        }
        if (!data.sku?.trim()) {
            throw new ProductServiceError("Product SKU is required");
        }
        if (data.price < 0) {
            throw new ProductServiceError("Product price cannot be negative");
        }

        try {
            const response = await api.post<ApiResponse<Product>>(
                API_ENDPOINTS.admin.products.create,
                data
            );

            const product = response.data.data || response.data;

            if (!product) {
                throw new ProductServiceError("Invalid response format");
            }

            return product;
        } catch (error) {
            this.handleApiError(error, "Error creating product");
        }
    }

    async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
        if (!id?.trim()) {
            throw new ProductServiceError("Product ID is required");
        }

        // Validation for update data
        if (data.price !== undefined && data.price < 0) {
            throw new ProductServiceError("Product price cannot be negative");
        }

        try {
            const response = await api.put<ApiResponse<Product>>(
                API_ENDPOINTS.admin.products.update(id),
                data
            );

            const product = response.data.data || response.data;

            if (!product) {
                throw new ProductServiceError("Invalid response format");
            }

            return product;
        } catch (error) {
            this.handleApiError(error, "Error updating product");
        }
    }

    async deleteProduct(id: string): Promise<void> {
        if (!id?.trim()) {
            throw new ProductServiceError("Product ID is required");
        }

        try {
            await api.delete(API_ENDPOINTS.admin.products.delete(id));
        } catch (error) {
            this.handleApiError(error, "Error deleting product");
        }
    }
}

export const productService = new ProductService();


/*
export const productService = {
    getProducts: async (filters: ProductFilters = {}): Promise<ProductsListResponse> => {
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

            if (!response?.data.data) {
                throw new Error("Product not found");
            }

            return response.data.data;
        } catch (error) {
            console.error("Error fetching product:", error);
            throw new Error("Failed to fetch product");
        }
    },

    createProduct: async (data: CreateProductDto): Promise<Product> => {
        try {
            const response = await api.post(API_ENDPOINTS.admin.products.create, data);

            if (!response?.data) {
                throw new Error("Invalid response format");
            }

            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error("Failed to create product");
        }
    },

    updateProduct: async (id: string, data: UpdateProductDto): Promise<Product> => {
        try {
            const response = await api.put(API_ENDPOINTS.admin.products.update(id), data);

            if (!response.data?.data) {
                throw new Error('Invalid response format');
            }

            return response.data.data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw new Error("Failed to update product");
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
}*/
