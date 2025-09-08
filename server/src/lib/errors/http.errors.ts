import { BaseError, ErrorContext } from "./base.error";

export class HttpError extends BaseError {
    constructor(
        message: string,
        statusCode: number,
        errorCode: string,
        originalError?: unknown,
        context?: ErrorContext,
    ) {
        super(message, statusCode, errorCode, true, originalError, context);
    }
}

// 4xx Client Errors
export class BadRequestError extends HttpError {
    constructor(
        message: string = "Bad Request",
        context?: ErrorContext,
    ) {
        super(message, 400, "BAD_REQUEST", undefined, context);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(
        message: string = "Unauthorized",
        context?: ErrorContext,
    ) {
        super(message, 401, "UNAUTHORIZED", undefined, context);
    }
}

export class ForbiddenError extends HttpError {
    constructor(
        message: string = "Access forbidden",
        context?: ErrorContext,
    ) {
        super(message, 403, "FORBIDDEN", undefined, context);
    }
}

export class NotFoundError extends HttpError {
    constructor(
        message: string = "Resource not found",
        context?: ErrorContext,
    ) {
        super(message, 404, "NOT_FOUND", undefined, context);
    }
}

export class MethodNotAllowedError extends HttpError {
    constructor(
        message: string = "Method not allowed",
        context?: ErrorContext,
    ) {
        super(message, 405, "METHOD_NOT_ALLOWED", undefined, context);
    }
}

export class ConflictError extends HttpError {
    constructor(
        message: string = "Resource conflict",
        context?: ErrorContext,
    ) {
        super(message, 409, "CONFLICT", undefined, context);
    }
}

export class TooManyRequestsError extends HttpError {
    constructor(
        message: string = "Too many requests",
        context?: ErrorContext,
    ) {
        super(message, 429, "TOO_MANY_REQUESTS", undefined, context);
    }
}

// 5xx Server Errors
export class InternalServerError extends HttpError {
    constructor(
        message: string = "Internal server error",
        context?: ErrorContext,
    ) {
        super(message, 500, "INTERNAL_SERVER_ERROR", undefined, context);
    }
}

export class NotImplementedError extends HttpError {
    constructor(
        message: string = "Not implemented",
        context?: ErrorContext,
    ) {
        super(message, 501, "NOT_IMPLEMENTED", undefined, context);
    }
}

export class BadGatewayError extends HttpError {
    constructor(
        message: string = "Bad Gateway",
        context?: ErrorContext,
    ) {
        super(message, 502, "BAD_GATEWAY", undefined, context);
    }
}

export class ServiceUnavailableError extends HttpError {
    constructor(
        message: string = "Service unavailable",
        context?: ErrorContext,
    ) {
        super(message, 503, "SERVICE_UNAVAILABLE", undefined, context);
    }
}

export class GatewayTimeoutError extends HttpError {
}