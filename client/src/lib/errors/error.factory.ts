import { ApiError, NetworkError, TimeoutError } from "./api.error";
import { BaseError, ErrorContext } from "./base.error";
import { CategoryServiceError, OrderServiceError, ProductServiceError, UploadServiceError } from "./service.error";
import { ValidationError, ValidationIssue } from "./validation.error";

export class ErrorFactory {
    static createApiError(error: unknown, context?: ErrorContext): BaseError {
        // Handle axios errors
        if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as any;

            if (axiosError.response) {
                const message = axiosError.response.data?.message || 
                                axiosError.response.statusText || 
                                "Api request failed";
                const statusCode = axiosError.response.status;
                const errorCode = axiosError.response.data?.code || "API_ERROR";

                return new ApiError(message, statusCode, errorCode, error, {
                    ...context,
                    url: axiosError.config?.url,
                    method: axiosError.config?.method,
                });
            }

            if (axiosError.request) {
                return new NetworkError('Network error occurred', error, context);
            }
        }

        // Handle timeout errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
            return new TimeoutError('Request timeout', error, context);
        }

        // Handle BaseError Instance
        if (error instanceof BaseError) {
            return error;
        }

        // Handle generic errors
        if (error instanceof Error) {
            return new ApiError(error.message, 500, "UNKNOWN_ERROR", error, context);
        }

        // Handle unknown errors
        return new ApiError("An unexcepted error occurred", 500, "UNKNOWN_ERROR", error, context);
    }

    static createValidationError(issues: ValidationIssue[], message?: string, context?: ErrorContext): ValidationError {
        return new ValidationError(message, issues, context);
    }

    static createServiceError(
        service: "product" | "category" | "order" | "upload",
        message: string, 
        statusCode: number = 500,
        originalError?: unknown,
        context?: ErrorContext
    ): BaseError {
        switch (service) {
            case "product": 
                return new ProductServiceError(message, statusCode, "PRODUCT_ERROR", originalError, context);
            case "category":
                return new CategoryServiceError(message, statusCode, "CATEGORY_ERROR", originalError, context);
            case "order":
                return new OrderServiceError(message, statusCode, "ORDER_ERROR", originalError, context);
            case "upload":
                return new UploadServiceError(message, statusCode, "UPLOAD_ERROR", originalError, context);
            default:
                return new ApiError(message, statusCode, "SERVICE_ERROR", originalError, context);
        }
    }
}