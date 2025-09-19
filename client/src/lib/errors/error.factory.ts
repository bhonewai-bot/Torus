import { ApiError, NetworkError, TimeoutError } from "./api.error";
import { BaseError, ErrorContext } from "./base.error";
import { CategoryServiceError, OrderServiceError, ProductServiceError, UploadServiceError } from "./service.error";
import { ValidationError, ValidationIssue } from "./validation.error";
import { 
    BadRequestError, 
    UnauthorizedError, 
    ForbiddenError, 
    NotFoundError, 
    ConflictError, 
    InternalServerError 
} from "./http.errors";

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
                const serverErrorCode = axiosError.response.data?.errorCode || axiosError.response.data?.code;

                const commonContext = {
                    ...context,
                    url: axiosError.config?.url,
                    method: axiosError.config?.method,
                };

                // Map HTTP status codes to specific error classes
                switch (statusCode) {
                    case 400:
                        return new BadRequestError(message, commonContext);
                    case 401:
                        return new UnauthorizedError(message, commonContext);
                    case 403:
                        return new ForbiddenError(message, commonContext);
                    case 404:
                        return new NotFoundError(message, commonContext);
                    case 409:
                        return new ConflictError(message, commonContext);
                    case 500:
                    case 502:
                    case 503:
                    case 504:
                        return new InternalServerError(message, commonContext);
                    default:
                        // For other status codes, use ApiError with server's error code if available
                        const errorCode = serverErrorCode || this.getErrorCodeFromStatus(statusCode);
                        return new ApiError(message, statusCode, errorCode, error, commonContext);
                }
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
        return new ApiError("An unexpected error occurred", 500, "UNKNOWN_ERROR", error, context);
    }

    private static getErrorCodeFromStatus(statusCode: number): string {
        const statusCodeMap: Record<number, string> = {
            400: "BAD_REQUEST",
            401: "UNAUTHORIZED", 
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            409: "CONFLICT",
            422: "VALIDATION_ERROR",
            500: "INTERNAL_SERVER_ERROR",
            502: "BAD_GATEWAY",
            503: "SERVICE_UNAVAILABLE",
            504: "GATEWAY_TIMEOUT"
        };

        return statusCodeMap[statusCode] || "API_ERROR";
    }

    static createValidationError(issues: ValidationIssue[], message?: string, context?: ErrorContext): ValidationError {
        return new ValidationError(message, issues, context);
    }

    static createServiceError(
        service: "product" | "category" | "order" | "upload" | "user",
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
            case "user":
                return new ApiError(message, statusCode, "USER_ERROR", originalError, context);
            default:
                return new ApiError(message, statusCode, "SERVICE_ERROR", originalError, context);
        }
    }
}