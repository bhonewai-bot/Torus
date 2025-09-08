export interface ErrorContext {
    [key: string]: unknown;
}

export interface ErrorMetadata {
    timestamp: Date;
    requestId?: string;
    userId?: string;
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
            context
        }

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    public toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            errorCode: this.errorCode,
            metadata: this.metadata,
            stack: this.stack,
        }
    }
}