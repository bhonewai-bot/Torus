import { ErrorFactory, ErrorHandler } from "../errors";

export abstract class BaseApiService {
    protected errorHandler: ErrorHandler;
    protected serviceName: string;

    constructor(serviceName: string) {
        this.serviceName = serviceName;
        this.errorHandler = new ErrorHandler({
            enableLogging: true,
            logLevel: "error",
            enableNotification: false,
        });
    }

    protected async handleRequest<T>(
        request: () => Promise<T>,
        operation: string,
        context?: Record<string, unknown>
    ): Promise<T> {
        try {
            return await request();
        } catch (error) {
            const processedError = ErrorFactory.createServiceError(
                this.serviceName as any,
                `Failed to ${operation}`,
                (error as any).statusCode || 500,
                error, 
                {
                    operation,
                    service: this.serviceName,
                    ...context
                }
            );
            throw this.errorHandler.handle(processedError);
        }
    }

    protected handleValidation(condition: boolean, message: string, field: string = "input"): void {
        if (!condition) {
            throw ErrorFactory.createValidationError(
                [{ field, message, code: "validation_error" }],
                message,
                { service: this.serviceName}
            );
        }
    }
}