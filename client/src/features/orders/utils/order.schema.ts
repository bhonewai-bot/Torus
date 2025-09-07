import {z} from "zod";
import {ORDER_STATUSES, PAYMENT_STATUSES} from "@/features/orders/types/order.types";

export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);
export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const updateOrderStatusSchema = z.object({
    paymentStatus: paymentStatusSchema.optional(),
    orderStatus: orderStatusSchema.optional(),
});

export type updateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;