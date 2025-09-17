import {z} from "zod";

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
    limit: z.coerce.number().int().min(-1).max(1000).default(10),

    orderStatus: orderStatusSchema.optional(),
    userId: z.string().uuid().optional(),
    search: z.string().optional(),

    sortBy: z.enum(["orderNumber", "createdAt", "total"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const updateOrderStatusSchema = z.object({
    orderStatus: orderStatusSchema,
});

export type updateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>