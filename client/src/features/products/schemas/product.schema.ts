import {z} from "zod";

export const createProductSchema = z.object({
    sku: z.string()
        .min(1, "SKU is required")
        .max(30, "SKU must be less than 30 characters"),
    title: z.string()
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title must be less than 100 characters"),
    brand: z.string()
        .min(1, "Brand is required")
        .max(50, "Brand must be less than 50 characters").optional(),
    description: z.string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),
    categoryId: z.string().optional(),
    dimensions: z.object({
        length: z.coerce.number().min(0, "Length must be positive").optional(),
        width: z.coerce.number().min(0, "Width must be positive").optional(),
        height: z.coerce.number().min(0, "Height must be positive").optional(),
        weight: z.coerce.number().min(0, "Weight must be positive").optional(),
    }).optional().nullable(),
    pricing: z.object({
        price: z.coerce.number()
            .min(0.01, "Price must be greater than 0")
            .max(999999.99, "Price must be less than 1,000,000"),
        regularPrice: z.coerce.number().optional(),
        salePrice: z.coerce.number().optional(),
        taxRate: z.coerce.number().min(0).max(100).optional(),
        taxIncluded: z.boolean().optional(),
    }),
    inventory: z.object({
        quantity: z.coerce.number()
            .min(1, "Quantity cannot be negative"),
    }),
    images: z.array(z.object({
        url: z.string().url("Invalid image URL"),
        isMain: z.boolean().optional(),
    })).optional().default([]),
    isActive: z.boolean().optional().default(true),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;