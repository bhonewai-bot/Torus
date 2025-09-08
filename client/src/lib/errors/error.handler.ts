import { BaseError, ErrorContext } from "./base.error";
import { ErrorFactory } from "./error.factory";

export interface ErrorHandlerOptions {
    enableLogging?: boolean;
    logLevel?: "error" | "warn" | "info";
    enableNotification?: boolean;
}

export class ErrorHandler {
    private options: ErrorHandlerOptions;
    
    constructor(options: ErrorHandlerOptions = {}) {
        this.options = {
            enableLogging: true,
            logLevel: "error",
            enableNotification: false,
            ...options,
        }
    }

    public handle(error: unknown, context?: ErrorContext): BaseError {
        const processedError = ErrorFactory.createApiError(error, context);

        if (this.options.enableLogging) {
            this.logError(processedError);
        }

        if (this.options.enableNotification && !processedError.isOperational) {
            this.notifyError(processedError);
        }

        return processedError;
    }

    private logError(error: BaseError): void {
        const logData = {
            ...error.toJSON(),
            userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
            url: typeof window !== "undefined" ? window.location.href : undefined,
        }

        console[this.options.logLevel!]("Error occurred:", logData);
    }

    private notifyError(error: BaseError): void {
        console.warn("Critical error notification:", error.toJSON());
    }
}