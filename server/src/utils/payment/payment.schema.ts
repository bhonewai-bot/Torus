import z from "zod";

export const paymentStatusSchema = z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]);

export const createPaymentSchema = z.object({
    method: z.string().min(1, "Payment method is required"),
    provider: z.string().min(1, "Payment provider is required"),
    transactionId: z.string().optional(),
    amount: z.number().positive("Amount must be positive"),
    currency: z.string().default("THB"),
    status: paymentStatusSchema.default("PENDING"),
});

export const updatePaymentSchema = createPaymentSchema.partial();

export type createPaymentDto = z.infer<typeof createPaymentSchema>;
export type updatePaymentDto = z.infer<typeof updatePaymentSchema>;