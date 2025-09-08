import { BaseError, ErrorContext } from "./base.error";

export class BusinessLogicError extends BaseError {
    public readonly businessRule: string;

    constructor(
        message: string,
        businessRule: string,
        statusCode: number = 400,
        errorCode: string = "BUSINESS_RULE_VALIDATION",
        originalError?: unknown,
        context?: ErrorContext,
    ) {
        super(message, statusCode, errorCode, true, originalError, context);
        this.businessRule = businessRule;
    }

    public toResponse() {
        return {
            ...super.toResponse(),
            businessRule: this.businessRule,
        }
    }
}

export class InsufficientInventoryError extends BusinessLogicError {
    constructor(
        productId: string,
        requested: number,
        available: number,
        context?: ErrorContext
    ) {
        super(
            `Insufficient inventory. Requested: ${requested}, Available: ${available}`,
            'INVENTORY_CHECK',
            400,
            'INSUFFICIENT_INVENTORY',
            undefined,
            { ...context, productId, requested, available }
        )
    }
}

export class OrderStatusError extends BusinessLogicError {
    constructor(
        orderId: string,
        currentStatus: string,
        attemptedAction: string,
        context?: ErrorContext,
    ) {
        super(
            `Cannot ${attemptedAction} order in ${currentStatus} status`,
            "ORDER_STATUS_TRANSITION",
            400,
            "INVALID_ORDER_STATUS",
            undefined,
            { ...context, orderId, currentStatus, attemptedAction }
        )
    }
}