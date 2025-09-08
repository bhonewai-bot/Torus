export interface ErrorContext {
    [key: string]: unknown;
}

export interface ErrorMetadata {
    timestamp: Date;
    requestId?: string;
    userId?: string;
    userAgent?: string;
    ip?: string;
    route?: string;
    method?: string;
    context?: ErrorContext;
}

export abstract class BaseError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly isOperational: boolean;
    public readonly metadata: ErrorMetadata;
    public readonly originalError?: unknown;

    constructor(
        message: string,
        statusCode: number,
        errorCode: string,
        isOperational: boolean = true,
        originalError?: unknown,
        context?: ErrorContext
    ) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        this.originalError = originalError;
        this.metadata = {
            timestamp: new Date(),
            context,
        };

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    public toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode:this.statusCode,
            errorCode: this.errorCode,
            metadata: this.metadata,
            stack: this.stack,
        }
    }

    public toResponse() {
        return {
            success: false,
            message: this.message,
            code: this.errorCode,
            timestamp: this.metadata.timestamp,
            requestId: this.metadata.requestId,
        }
    }
}