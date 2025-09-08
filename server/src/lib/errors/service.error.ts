import { BaseError, ErrorContext } from "./base.error";

export class ServiceError extends BaseError {
    public readonly service: string;

    constructor(
        service: string,
        message: string,
        statusCode: number = 500,
        errorCode: string = "SERVICE_ERROR",
        originalError?: unknown,
        context?: ErrorContext,
    ) {
        super(message, statusCode, errorCode, true, originalError, context);
        this.service = service;
    }

    public toResponse() {
        return {
            ...super.toResponse(),
            service: this.service,
        }
    }
}

// External service errors
export class PaymentServiceError extends ServiceError {
    constructor(
      message: string,
      statusCode: number = 502,
      originalError?: unknown,
      context?: ErrorContext
    ) {
      super('PaymentService', message, statusCode, 'PAYMENT_SERVICE_ERROR', originalError, context);
    }
}

export class EmailServiceError extends ServiceError {
    constructor(
      message: string,
      statusCode: number = 502,
      originalError?: unknown,
      context?: ErrorContext
    ) {
      super('EmailService', message, statusCode, 'EMAIL_SERVICE_ERROR', originalError, context);
    }
}
  
export class FileUploadError extends ServiceError {
    constructor(
      message: string,
      statusCode: number = 400,
      originalError?: unknown,
      context?: ErrorContext
    ) {
      super('FileUploadService', message, statusCode, 'FILE_UPLOAD_ERROR', originalError, context);
    }
}