import api from "@/lib/api/client";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import { createCategoryDto } from "../utils/category.schema";
import { ErrorFactory, ErrorHandler } from "@/lib/errors";

const errorHanlder = new ErrorHandler();

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
        const processedError = ErrorFactory.createServiceError(
            "category",
            "Failed to fetch categories",
            (error as any).statusCode || 500,
            error,
            {
                operation: "getAllCategories",
                endpoing: API_ENDPOINTS.admin.categories.list
            }
        );
        throw errorHanlder.handle(processedError);
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
            throw ErrorFactory.createServiceError(
                "category",
                "Invalid response format",
                422,
                undefined,
                {
                    operation: "createCategory",
                    data
                }
            )
        }

        return category;
    } catch (error) {
        const processedError = ErrorFactory.createServiceError(
            "category",
            "Failed to create category",
            (error as any).statusCode || 500,
            error,
            {
                operation: "createCategory",
                endpoint: API_ENDPOINTS.admin.categories.create,
                data
            }
        )
    }
}

export const categoryService = {
    getAllCategories,
    createCategory,
}