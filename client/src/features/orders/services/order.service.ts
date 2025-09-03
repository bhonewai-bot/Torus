import {ApiResponse, OrderFilters, OrderResponse} from "@/features/orders/types/order.types";
import {OrderServiceError} from "@/features/orders/lib/error";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import api from "@/lib/api/client";

function buildQueryString(filters: OrderFilters): string {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
        }
    });

    return params.toString();
}

function handleApiResponse(error: unknown, context: string): never {
    console.error(`${context}:`, error);

    if (error instanceof Error) {
        if ("response" in error && typeof error.response === "object" && error.response) {
            const response = error.response as any;
            const message = response.data?.message || response.statusText || error.message;
            const statusCode = response.status;

            throw new OrderServiceError(message, statusCode, error);
        }
        throw new OrderServiceError(error.message, undefined, error);
    }
    throw new OrderServiceError(`Unknown error occurred in ${context}`, undefined, error);
}

export async function getAllOrders(filters: OrderFilters = {}): Promise<OrderResponse> {
    try {
        const queryString = buildQueryString(filters);
        const url = queryString
            ? `${API_ENDPOINTS.admin.orders.list}?${queryString}`
            : API_ENDPOINTS.admin.orders.list;

        const response = await api.get<ApiResponse<OrderResponse>>(url);

        if (response.data.success || response.data.data) {
            return response.data.data;
        }

        return {
            orders: response.data.data?.orders || [],
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
        handleApiResponse(error, "Error fetching products");
    }
}

export const orderService = {
    getAllOrders,
}