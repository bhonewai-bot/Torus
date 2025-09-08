import { BaseError, ErrorContext } from "./base.error";

export class HttpError extends BaseError {
    constructor(
        message: string,
        statusCode: number,
        errorCode: string,
        originalError?: unknown,
        context?: ErrorContext
    ) {
        super(message, statusCode, errorCode, true, originalError, context);
    }
}

export class BadRequestError extends HttpError {
    constructor(
        message: string = "Bad Request",
        context?: ErrorContext
    ) {
        super(message, 400, "BAD_REQUEST", undefined, context);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(
        message: string = "Unauthorized",
        context?: ErrorContext
    ) {
        super(message, 401, "UNAUTHORIZED", undefined, context);
    }
}

export class ForbiddenError extends HttpError {
    constructor(
        message: string = "Forbidden",
        context?: ErrorContext
    ) {
        super(message, 403, "FORBIDDEN", undefined, context);
    }
}

export class NotFoundError extends HttpError {
    constructor(
        message: string = "Not Found",
        context?: ErrorContext
    ) {
        super(message, 404, "NOT_FOUND", undefined, context);
    }
}

export class ConflictError extends HttpError {
    constructor(
        message: string = "Conflict",
        context?: ErrorContext
    ) {
        super(message, 409, "CONFLICT", undefined, context);
    }
}

export class InternalServerError extends HttpError {
    constructor(
        message: string = "Internal Server Error",
        context?: ErrorContext
    ) {
        super(message, 500, "INTERNAL_SERVER_ERROR", undefined, context);
    }
}