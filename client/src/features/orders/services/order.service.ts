import {ApiResponse, OrderDetail, OrderFilters, OrderResponse} from "@/features/orders/types/order.types";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import api from "@/lib/api/client";
import {updateOrderStatusDto} from "@/features/orders/utils/order.schema";
import { ErrorFactory, ErrorHandler, ValidationError } from "@/lib/errors";

function buildQueryString(filters: OrderFilters): string {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
        }
    });

    return params.toString();
}

const errorHandler = new ErrorHandler();

export async function getOrders(filters: OrderFilters = {}): Promise<OrderResponse> {
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
            orders: (response.data.data as OrderResponse).orders || [],
            pagination: (response.data.data as OrderResponse).pagination || {
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
            "order",
            "Failed to fetch orders",
            (error as any).statusCode || 500,
            error,
            {
                operation: "getOrders",
                endpoint: API_ENDPOINTS.admin.orders.list,
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function getOrder(id: string): Promise<OrderDetail> {
    if (!id) {
        throw ErrorFactory.createValidationError(
            [{ field: "id", message: "Order ID is required", code: "required" }],
            "Order ID validation failed",
            { operation: "getOrder" },
        );
    }

    try {
        const response = await api.get<ApiResponse<OrderDetail>>(
            API_ENDPOINTS.admin.orders.get(id)
        );

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw ErrorFactory.createServiceError(
            "order",
            "Order not found",
            404,
            undefined,
            { operation: "getOrder", orderId: id }
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createServiceError(
            "order",
            "Failed to fetch order",
            (error as any).statusCode || 500,
            error,
            {
                operation: 'getOrderById',
                orderId: id,
                endpoint: API_ENDPOINTS.admin.orders.get(id)
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function updateOrderStatus(id: string, data: updateOrderStatusDto) {
    if (!id) {
        throw ErrorFactory.createValidationError(
            [{ field: "id", message: "Order ID is required", code: "required" }],
            "Order ID validation failed",
            { operation: "updateOrderStatus" },
        )
    }

    try {
        const response = await api.patch(
            API_ENDPOINTS.admin.orders.updateStatus(id),
            data
        );
        return response.data;
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createServiceError(
            "order",
            "Failed to update order status",
            (error as any).statusCode || 500,
            error,
            {
                operation: 'updateOrderStatus',
                orderId: id,
                endpoint: API_ENDPOINTS.admin.orders.updateStatus(id),
                data
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export const orderService = {
    getOrders,
    getOrder,
    updateOrderStatus
}