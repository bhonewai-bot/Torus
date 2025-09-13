import {
    ApiResponse,
    ProductDetails,
    ProductFilters,
    ProductListResponse,
} from "@/features/products/types/product.types";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import api from "@/lib/api/client";
import {createProductDto, updateProductDto} from "@/features/products/utils/product.schema";
import { ErrorFactory, ErrorHandler, ValidationError } from "@/lib/errors";

function buildQueryString(filters: ProductFilters): string {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
        }
    });

    return params.toString();
}

const errorHandler = new ErrorHandler();

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
        const processedError = ErrorFactory.createServiceError(
            "product",
            "Failed to fetch products",
            (error as any).statusCode || 500,
            error,
            {
                operation: "getProducts",
                filters,
                endpoint: API_ENDPOINTS.admin.products.list
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function getProduct(id: string): Promise<ProductDetails> {
    if (!id) {
        throw ErrorFactory.createValidationError(
            [{ field: "id", message: "Product ID is required", code: "required" }],
            "Product ID validation failed",
            { operation: "getProduct" }
        )
    }

    try {
        const response = await api.get<ApiResponse<ProductDetails>>(
            API_ENDPOINTS.admin.products.get(id)
        );

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw ErrorFactory.createServiceError(
            "product",
            "Product not found",
            404,
            undefined,
            { operation: "getProduct", productId: id }
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createServiceError(
            "product",
            "Failed to fetch product",
            (error as any).statusCode || 500,
            error,
            {
                operation: 'getProduct',
                productId: id,
                endpoint: API_ENDPOINTS.admin.products.get(id)
            }
        );
        throw errorHandler.handle(processedError);
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
            throw ErrorFactory.createServiceError(
                "product",
                "Invalid response format",
                422,
                undefined,
                { operation: "createProduct", data }
            );
        }

        return product;
    } catch (error) {
        const processedError = ErrorFactory.createApiError(
            error,
            { 
                operation: "createProduct", 
                endpoint: API_ENDPOINTS.admin.products.create,
                data 
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function updateProduct(id: string, data: updateProductDto): Promise<ProductDetails> {
    if (!id) {
        throw ErrorFactory.createValidationError(
            [{ field: "id", message: "Product ID is required", code: "required" }],
            "Product ID validation failed",
            { operation: "updateProduct" }
        );
    }

    try {
        const response = await api.put<ApiResponse<ProductDetails>>(
            API_ENDPOINTS.admin.products.update(id),
            data,
        );

        const product = response.data.data || response.data;

        if (!product) {
            throw ErrorFactory.createServiceError(
                "product",
                "Invalid response format",
                422,
                undefined,
                { operation: "updateProduct", productId: id, data }
            );
        }

        return product;
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createApiError(
            error,
            {
                operation: "updateProduct",
                productId: id,
                endpoint: API_ENDPOINTS.admin.products.update(id),
                data
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function deleteProduct(id: string): Promise<void> {
    if (!id) {
        throw ErrorFactory.createValidationError(
            [{ field: "id", message: "Product ID is required", code: "required" }],
            "Product ID validation failed",
            { operation: "deleteProduct" },
        )
    }

    try {
        await api.delete(API_ENDPOINTS.admin.products.delete(id));
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createServiceError(
            "product",
            "Failed to delete product",
            (error as any).statusCode || 500,
            error,
            {
                operation: 'deleteProduct',
                productId: id,
                endpoint: API_ENDPOINTS.admin.products.delete(id)
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function bulkDeleteProducts(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) {
        throw ErrorFactory.createValidationError(
            [{ field: "ids", message: "Product IDs are required", code: "required" }],
            "Product IDs validation failed",
            { operation: "bulkDeleteProducts" },
        )
    }

    try {
        await api.post(API_ENDPOINTS.admin.products.bulkDelete, { ids });
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createApiError(
            error,
            {
                operation: 'bulkDeleteProducts',
                endpoint: API_ENDPOINTS.admin.products.bulkDelete,
                ids
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export const productService = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
}