import {z} from "zod";
import {OrderStatus} from "@prisma/client";

// Common
export const postgresIdPathSchema = z.object({
    id: z.string().uuid(),
});

// Category
export const createCategorySchema = z.object({
    title: z.string().min(1, "Title is required").trim(),
});

// Inventory
export const updateInventorySchema = z.object({
    quantity: z.coerce.number(),
});

export const bulkInventoryUpdateSchema = z.object({
    updates: z.array(
        z.object({
            productId: z.string().uuid(),
            quantity: z.coerce.number(),
        })
    )
});

// User
export const updateUserStatusSchema = z.object({
    enabled: z.boolean(),
});

// Order
export const updateOrderStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus),
})