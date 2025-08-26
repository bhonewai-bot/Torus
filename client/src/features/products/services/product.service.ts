import {
    ApiResponse, CreateProductDto,
    ProductDetails,
    ProductFilters,
    ProductListResponse
} from "@/features/products/types/product.types";
import {ProductServiceError} from "@/features/products/lib/error";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import api from "@/lib/api/client";

function buildQueryString(filters: ProductFilters): string {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
        }
    });

    return params.toString();
}

function handleApiError(error: unknown, context: string): never {
    console.error(`${context}:`, error);

    if (error instanceof Error) {
        if ("response" in error && typeof error.response === "object" && error.response) {
            const response = error.response as any;
            const message = response.data?.message || response.statusText || error.message;
            const statusCode = response.status;

            throw new ProductServiceError(message, statusCode, error);
        }
        throw new ProductServiceError(error.message, undefined, error);
    }
    throw new ProductServiceError(`Unknown error occurred in ${context}`, undefined, error);
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    try {
        const queryString = buildQueryString(filters);
        const url = queryString
            ? `${API_ENDPOINTS.admin.products.list}?${queryString}`
            : API_ENDPOINTS.admin.products.list;

        const response = await api.get<ApiResponse<ProductListResponse>>(url);

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        return {
            products: response.data.data?.products || [],
            pagination: response.data.data?.pagination || {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            }
        }
    } catch (error) {
        handleApiError(error, "Error fetching products");
    }
}

export async function getProduct(id: string): Promise<ProductDetails> {
    if (!id) {
        throw new ProductServiceError("Product ID is required");
    }

    try {
        const response = await api.get<ApiResponse<ProductDetails>>(
            API_ENDPOINTS.admin.products.get(id)
        );

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw new ProductServiceError("Product not found", 404);
    } catch (error) {
        handleApiError(error, "Error fetching product");
    }
}

export async function createProduct(data: CreateProductDto): Promise<ProductDetails> {
    try {
        const response = await api.post<ApiResponse<ProductDetails>>(
            API_ENDPOINTS.admin.products.create,
            data
        );

        const product = response.data.data || response.data;

        if (!product) {
            throw new ProductServiceError("Invalid response format");
        }

        return product
    } catch (error) {
        handleApiError(error, "Error creating product");
    }
}

export const productService = {
    getProducts,
    getProduct,
    createProduct
}

/*
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

export const productService = new ProductService();*/


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
