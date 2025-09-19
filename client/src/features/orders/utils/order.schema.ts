import {z} from "zod";
import {ORDER_STATUSES} from "@/features/orders/types/order.types";

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const updateOrderStatusSchema = z.object({
    orderStatus: orderStatusSchema
});

export type updateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;