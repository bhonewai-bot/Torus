import { BaseError, ErrorContext } from "./base.error";

export class ApiError extends BaseError {
    constructor(
        message: string,
        statusCode: number = 500,
        errorCode: string = "API_ERROR",
        originalError?: unknown,
        context?: ErrorContext,
    ) {
        super(message, statusCode, errorCode, true, originalError, context);
    }
}

export class NetworkError extends BaseError {
    constructor(
        message: string = "Network error occurred",
        originalError?: unknown,
        context?: ErrorContext,
    ) {
        super(message, 0, "NETWORK_ERROR", true, originalError, context);
    }
}

export class TimeoutError extends BaseError {
    constructor(
        message: string = "Request timeout",
        originalError?: unknown,
        context?: ErrorContext,
    ) {
        super(message, 408, "TIMEOUT_ERROR", true, originalError, context);
    }
}