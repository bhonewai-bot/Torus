import {z} from "zod";

export const productStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const productQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(-1).max(1000).default(10),
    categoryId: z.string().uuid().optional(),
    brand: z.string().optional(),
    status: z.boolean().optional(),
    search: z.string().optional(),
    sortBy: z.enum(["title", "price", "createdAt", "updatedAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const createProductImageSchema = z.object({
    url: z.string().url("Invalid image URL"),
    isMain: z.boolean().default(false),
});

export const updateProductImageSchema = z.object({
    id: z.string().uuid().optional(),
    url: z.string().url("Invalid image URL"),
    isMain: z.boolean().default(false),
});

export const createProductSchema = z.object({
    sku: z.string()
        .min(1, "SKU is required")
        .max(30, "SKU too long")
        .regex(/^[A-Z0-9\-_]+$/i, 'SKU can only contain letters, numbers, hyphens, and underscores'),
    title: z.string()
        .min(2, "Title is required")
        .max(100, "Title too long"),
    brand: z.string()
        .max(50, "Brand name too long")
        .optional(),
    description: z.string()
        .max(1000, "Description too long")
        .optional(),

    length: z.number().positive("Length must be positive").optional(),
    width: z.number().positive("Width must be positive").optional(),
    height: z.number().positive("Height must be positive").optional(),
    weight: z.number().positive( "Weight must be positive").optional(),

    price: z.number().positive("Price must be positive"),
    regularPrice: z.number().positive("Regular price must be positive").optional(),
    salePrice: z.number().positive("Sale price must be positive").optional(),
    taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100").optional(),
    taxIncluded: z.boolean().default(false),

    quantity: z.number().int().min(0, "Quantity must be positive").default(0),

    categoryId: z.string().uuid("Invalid category ID").optional(),
    images: z.array(createProductImageSchema)
        .optional()
        .default([])
        .refine(
            (images) => {
                if (!images.length) return true;
                const mainImages = images.filter((img) => img.isMain);
                return mainImages.length <= 1;
            },
            { message: "Only one image can be marked as main" }
        ),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateProductSchema = createProductSchema.partial().extend({
    images: z.array(updateProductImageSchema)
        .optional()
        .default([])
        .refine(
            (images) => {
                if (!images.length) return true;
                const mainImages = images.filter((img) => img.isMain);
                return mainImages.length <= 1;
            },
            { message: "Only one image can be marked as main" }
        ),
});

export const bulkDeleteProductsSchema = z.object({
    ids: z.array(z.string().uuid()).nonempty("At least one product ID is required"),
});

export type createProductDto = z.infer<typeof createProductSchema>;
export type updateProductDto = z.infer<typeof updateProductSchema>;
export type createProductImageDto = z.infer<typeof createProductImageSchema>;
export type updateProductImageDto = z.infer<typeof updateProductImageSchema>;