import { BaseError } from "@src/lib/errors/base.error";
import { ErrorFactory } from "@src/lib/errors/error.factory";
import { NextFunction, Request, Response } from "express";

export interface ErrorHandlerOptions {
    enableLogging?: boolean;
    logLevel?: "error" | "warn" | "info";
    includeStack?: boolean;
    enableNotification?: boolean;
}

export class ErrorHandler {
    private options: ErrorHandlerOptions;

    constructor(options: ErrorHandlerOptions = {}) {
        this.options = {
            enableLogging: true,
            logLevel: "error",
            includeStack: process.env.NODE_ENV === "development",
            enableNotification: process.env.NODE_ENV === "production",
            ...options,
        }
    }

    public handle() {
        return (error: unknown, req: Request, res: Response, next: NextFunction) => {
            // Convert unknown error to BaseError
            const processedError = ErrorFactory.fromUnknownError(error, req);

            // Log error
            if (this.options.enableLogging) {
                this.logError(processedError, req);
            }

            // Send notification for critical errors
            if (this.options.enableNotification && (!processedError.isOperational || processedError.statusCode >= 500)) {
                this.notifyError(processedError, req);
            }

            // Send response
            this.sendErrorResponse(processedError, res);
        }
    }
    
    private logError(error: BaseError, req: Request): void {
        const logData = {
            error: error.toJSON(),
            request: {
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: req.method !== "GET" ? req.body : undefined,
                query: req.query,
                params: req.params,
                user: (req as any).user?.id,
            }
        }

        console[this.options.logLevel!](`[${error.errorCode}] ${error.message}`, logData);
    }

    private notifyError(error: BaseError, req: Request): void {
        // Implement error notification logic
        // This could be Sentry, DataDog, CloudWatch, etc.
        console.error('Critical error notification:', {
          error: error.toJSON(),
          request: ErrorFactory.createRequestContext(req),
        });
    }

    private sendErrorResponse(error: BaseError, res: Response): void {
        const response = error.toResponse();
    
        // Include stack trace in development
        if (this.options.includeStack && error.stack) {
        (response as any).stack = error.stack;
        }
    
        res.status(error.statusCode).json(response);
    }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Express middleware function
export const handleErrors = errorHandler.handle();

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
    const error = ErrorFactory.notFound("Endpoint", req);
    res.status(error.statusCode).json(error.toResponse());
}

// Async error wrapper
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}