import { Payment } from "@src/types/payment.type";

export function formatPayment(payment: any): Payment {
    return {
        id: payment.id,
        method: payment.method,
        provider: payment.provider,
        transactionId: payment.transactionId ?? undefined,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt.toISOString(),
        updatedAt: payment.updatedAt.toISOString(),
    }
}