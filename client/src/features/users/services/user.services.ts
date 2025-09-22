import { ErrorFactory, ErrorHandler, ValidationError } from "@/lib/errors";
import { UserFilters } from "../types/user.types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import api from "@/lib/api/client";
import { updateUserRoleDto, updateUserStatusDto } from "../utils/user.schema";
import { get } from "lodash";

function buildQueryString(filters: UserFilters): string {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
        }
    });

    return params.toString();
}

const errorHandler = new ErrorHandler();


export async function getUsers(filters: UserFilters = {}) {
    try {
        const queryString = buildQueryString(filters);
        const url = queryString
            ? `${API_ENDPOINTS.admin.users.list}?${queryString}`
            : API_ENDPOINTS.admin.users.list;

        const response = await api.get(url);

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        return {
            users: response.data.data?.users || [],
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
            "user",
            "Failed to fetch users",
            (error as any).statusCode || 500,
            error,
            { operation: "getUsers" }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function getUser(id: string) {
    if (!id) {
        throw ErrorFactory.createValidationError(
            [{ field: "id", message: "User ID is required", code: "required" }],
            "User ID validation failed",
            { operation: "getUser" }
        )
    }

    try {
        const response = await api.get(
            API_ENDPOINTS.admin.users.get(id)
        );

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw ErrorFactory.createServiceError(
            "user",
            "User not found",
            404,
            undefined,
            { operation: "getUser", userId: id }
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createServiceError(
            "user",
            "Failed to fetch user",
            (error as any).statusCode || 500,
            error,
            {
                operation: 'getUser',
                userId: id,
                endpoint: API_ENDPOINTS.admin.users.get(id)
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function updateUserRole(id: string, data: updateUserRoleDto) {
    if (!id) {
        throw ErrorFactory.createValidationError(
            [{ field: "id", message: "User ID is required", code: "required" }],
            "User ID validation failed",
            { operation: "updateUserRole" }
        )
    }

    try {
        const response = await api.patch(
            API_ENDPOINTS.admin.users.updateRole(id),
            data
        );
        return response.data;
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createServiceError(
            "user",
            "Failed to update user role",
            (error as any).statusCode || 500,
            error,
            {
                operation: 'updateUserRole',
                userId: id,
                endpoint: API_ENDPOINTS.admin.users.updateRole(id),
                data
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function updateUserStatus(id: string, data: updateUserStatusDto) {
    if (!id) {
        throw ErrorFactory.createValidationError(
            [{ field: "id", message: "User ID is required", code: "required" }],
            "User ID validation failed",
            { operation: "updateUserStatus" }
        )
    }

    try {
        const response = await api.patch(
            API_ENDPOINTS.admin.users.updateStatus(id),
            data
        );
        return response.data;
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createServiceError(
            "user",
            "Failed to update user status",
            (error as any).statusCode || 500,
            error,
            {
                operation: 'updateUserStatus',
                userId: id,
                endpoint: API_ENDPOINTS.admin.users.updateStatus(id),
                data
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export const userService = {
    getUsers,
    getUser,
    updateUserRole,
    updateUserStatus
}