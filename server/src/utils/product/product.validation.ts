import {z} from "zod";

export const productQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    categoryId: z.string().uuid().optional(),
    brand: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    search: z.string().optional(),
    sortBy: z.enum(["title", "price", "createdAt", "updatedAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

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