import {z} from "zod";

export const paymentStatusSchema = z.enum([
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED",
]);

export const orderStatusSchema = z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELED",
]);

export const orderQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),

    paymentStatus: paymentStatusSchema.optional(),
    orderStatus: orderStatusSchema.optional(),
    userId: z.string().uuid().optional(),
    search: z.string().optional(),

    sortBy: z.enum(["createdAt", "updatedAt", "total", "subtotal", "paymentStatus", "orderStatus"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const updateOrderStatusSchema = z.object({
    paymentStatus: paymentStatusSchema.optional(),
    orderStatus: orderStatusSchema.optional(),
}).refine((data) => data.paymentStatus || data.orderStatus, {
    message: "At least one of the paymentStatus or orderStatus must be provided",
    path: ["root"],
});

export type updateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>