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

    public toJSON() {
        return {
            ...super.toJSON(),
            service: this.service,
        }
    }
}

export class ProductServiceError extends ServiceError {
    constructor(
        message: string,
        statusCode: number = 500,
        errorCode: string = "PRODUCT_SERVICE_ERROR",
        originalError?: unknown,
        context?: ErrorContext,
    ) {
        super("ProductService", message, statusCode, errorCode, originalError, context);
    }
}

export class CategoryServiceError extends ServiceError {
  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'CATEGORY_SERVICE_ERROR',
    originalError?: unknown,
    context?: ErrorContext
  ) {
    super('CategoryService', message, statusCode, errorCode, originalError, context);
  }
}

export class OrderServiceError extends ServiceError {
  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'ORDER_SERVICE_ERROR',
    originalError?: unknown,
    context?: ErrorContext
  ) {
    super('OrderService', message, statusCode, errorCode, originalError, context);
  }
}

export class UploadServiceError extends ServiceError {
  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'UPLOAD_SERVICE_ERROR',
    originalError?: unknown,
    context?: ErrorContext
  ) {
    super('UploadService', message, statusCode, errorCode, originalError, context);
  }
}