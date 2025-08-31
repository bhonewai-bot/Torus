import {z} from "zod";
import {OrderStatus} from "@prisma/client";

export const orderStatusSchema = z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "COMPLETED",
    "CANCELED",
]);

export const orderQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),

    sortBy: z.enum(["createdAt", "updatedAt", "total", "subtotal", "status"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),

    status: orderStatusSchema.optional(),
    userId: z.string().uuid().optional(),
    search: z.string().min(1).optional(),

    /*createdAfter: z.coerce.date().optional(),
    createdBefore: z.coerce.date().optional(),
    updatedAfter: z.coerce.date().optional(),
    updatedBefore: z.coerce.date().optional(),

    minTotal: z.coerce.number().min(0).optional(),
    maxTotal: z.coerce.number().min(0).optional(),
    minSubtotal: z.coerce.number().min(0).optional(),
    maxSubtotal: z.coerce.number().min(0).optional(),

    includeItems: z.coerce.boolean().default(false),
    includeUsers: z.coerce.boolean().default(false),
    includeProducts: z.coerce.boolean().default(false),*/
})/*.refine(data => {
    if (data.createdAfter && data.createdBefore) {
        return data.createdAfter < data.createdBefore;
    }

    if (data.updatedAfter && data.updatedBefore) {
        return data.updatedAfter < data.updatedBefore;
    }

    if (data.minTotal && data.maxTotal) {
        return data.minTotal <= data.maxTotal;
    }

    if (data.minSubtotal && data.maxSubtotal) {
        return data.minSubtotal <= data.maxSubtotal;
    }
    return true;
}, {
    message: "Invalid range: 'from' value must be less than 'to' value"
})

export const createOrderItemSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({

})*/

export const updateOrderSchema = z.object({
    status: z.nativeEnum(OrderStatus).optional(),
    subtotal: z.number()
        .min(0, "Subtotal is required")
        .optional(),
    taxAmount: z.number()
        .min(0, "taxAmount is required")
        .optional(),
    total: z.number()
        .min(0, "Total is required")
        .optional(),
})