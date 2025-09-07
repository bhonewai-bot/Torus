import api from "@/lib/api/client";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import {CategoryServiceError} from "@/features/categories/lib/error";
import { createCategoryDto } from "../utils/category.schema";

function handleApiError(error: unknown, context: string): never {
    console.error(`${context}:`, error);

    if (error instanceof Error) {
        if ("response" in error && typeof error.response === "object" && error.response) {
            const response = error.response as any;
            const message = response.data?.message || response.statusText || error.message;
            const statusCode = response.status;

            throw new CategoryServiceError(message, statusCode, error);
        }
        throw new CategoryServiceError(error.message, undefined, error);
    }
    throw new CategoryServiceError(`Unknown error occurred in ${context}`, undefined, error);
}

export async function getAllCategories(): Promise<Category[]> {
    try {
        const response = await api.get(
            API_ENDPOINTS.admin.categories.list
        );

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        return [];
    } catch (error) {
        handleApiError(error, "Error fetching categories");
    }
}

export async function createCategory(data: createCategoryDto) {
    try {
        const response = await api.post(
            API_ENDPOINTS.admin.categories.create,
            data
        );

        const category = response.data.data || response.data;

        if (!category) {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        handleApiError(error, "Error creating category");
    }
}

export const categoryService = {
    getAllCategories,
    createCategory,
}