import {z} from "zod";
import {OrderStatus} from "@prisma/client";

// Common
export const postgresIdPathSchema = z.object({
    id: z.string().uuid(),
});

export const paginationQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
});

// Product
export const createProductImageSchema = z.object({
    url: z.string().url(),
    isMain: z.boolean().optional().default(false),
});

export const createProductSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    title: z.string().min(1, "Title is required"),
    brand: z.string().optional(),
    description: z.string().optional(),
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    weight: z.coerce.number().optional(),
    price: z.coerce.number().min(0, "Price cannot be non-negative"),
    regularPrice: z.coerce.number().optional(),
    salePrice: z.coerce.number().optional(),
    taxRate: z.number().min(0).max(100).optional(),
    taxIncluded: z.boolean().optional().default(false),
    quantity: z.coerce.number().min(0, "Quantity must be non-negative").optional().default(0),
    categoryId: z.string().uuid().optional(),
    images: z.array(createProductImageSchema).optional().default([]),
    isActive: z.boolean().default(true),
});

export const updateProductImageSchema = z.object({
    id: z.string().uuid().optional(),
    url: z.string().url(),
    isMain: z.boolean().optional().default(false),
});

export const updateProductSchema = z.object({
    sku: z.string().min(1, "SKU is required").optional(),
    title: z.string().min(1, "Title is required").optional(),
    brand: z.string().optional(),
    description: z.string().optional(),
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    weight: z.coerce.number().optional(),
    price: z.coerce.number().min(0, "Price cannot be non-negative").optional(),
    regularPrice: z.coerce.number().optional(),
    salePrice: z.coerce.number().optional(),
    taxRate: z.number().min(0).max(100).optional(),
    taxIncluded: z.boolean().optional(),
    quantity: z.coerce.number().min(0, "Quantity must be non-negative").optional(),
    categoryId: z.string().uuid().optional().nullable(),
    images: z.array(updateProductImageSchema).optional(),
    isActive: z.boolean().optional(),
});

export const addProductImagesSchema = z.object({
    images: z.preprocess((val) => {
        if (typeof val === 'string') {
            return val.split(',');
        }
    }, z.array(z.string())),
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