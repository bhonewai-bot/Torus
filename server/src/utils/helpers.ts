import {Pagination} from "@src/types/base.types";

export const calculatePagination = (total: number, page: number, limit: number): Pagination => {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    }
}

/**
 * Creates a standardized success response
 */
export const createSuccessResponse = <T>(
    message: string,
    data?: T,
    pagination?: any
) => {
    const response: any = {
        success: true,
        message,
    };

    if (data !== undefined) {
        response.data = data;
    }

    if (pagination) {
        response.pagination = pagination;
    }

    return response;
};

/**
 * Creates a standardized error response
 */
export const createErrorResponse = (
    message: string,
    code: string,
    statusCode: number,
    details?: any,
) => {
    const response: any = {
        success: false,
        message,
        code,
        statusCode,
        timestamp: new Date().toISOString(),
    }

    if (details && process.env.NODE_ENV === "development") {
        response.details = details;
    }

    return response;
}