import { PaymentMethod, PaymentStatus } from "@prisma/client";

export interface Payment {
    id: string;
    method: PaymentMethod;
    provider: string;
    transactionId?: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}