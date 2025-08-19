import {PaginationInfo} from "@src/types/ProductResponse";
import { Prisma } from "../../generated/prisma";

/**
 * Calculates pagination metadata
 */
/*export const calculatePagination = (total: number, page: number, limit: number) => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
    };
};*/

export const calculatePagination = (total: number, page: number, limit: number): PaginationInfo => {
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
 * Sanitizes string by removing extra whitespaces and converting to lowercase
 */
export const sanitizeString = (str: string): string => {
    return str.trim().toLowerCase();
};

/**
 * Generates a random SKU
 */
export const generateSKU = (prefix: string = 'PRD'): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${randomStr}`.toUpperCase();
};

/**
 * Validates if a string is a valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

/**
 * Converts string array to lowercase
 */
export const normalizeStringArray = (arr: string[]): string[] => {
    return arr.map(item => item.trim().toLowerCase());
};