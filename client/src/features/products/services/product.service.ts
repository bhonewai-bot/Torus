import {
    ApiResponse,
    ProductDetails,
    ProductFilters,
    ProductListResponse,
} from "@/features/products/types/product.types";
import {ProductServiceError} from "@/features/products/lib/product.error";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import api from "@/lib/api/client";
import {createProductDto, updateProductDto} from "@/features/products/utils/product.schema";

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

export async function createProduct(data: createProductDto): Promise<ProductDetails> {
    try {
        const response = await api.post<ApiResponse<ProductDetails>>(
            API_ENDPOINTS.admin.products.create,
            data
        );

        const product = response.data.data || response.data;

        if (!product) {
            throw new ProductServiceError("Invalid response format");
        }

        return product;
    } catch (error) {
        handleApiError(error, "Error creating product");
    }
}

export async function updateProduct(id: string, data: updateProductDto): Promise<ProductDetails> {
    try {
        const response = await api.put<ApiResponse<ProductDetails>>(
            API_ENDPOINTS.admin.products.update(id),
            data,
        );

        const product = response.data.data || response.data;

        if (!product) {
            throw new ProductServiceError("Invalid response format");
        }

        return product;
    } catch (error) {
        handleApiError(error, "Error updating product");
    }
}

export async function deleteProduct(id: string): Promise<void> {
    try {
        if (!id) {
            throw new Error("Product ID is required");
        }
        await api.delete(API_ENDPOINTS.admin.products.delete(id));
    } catch (error) {
        handleApiError(error, "Error deleting product");
    }
}

export const productService = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}