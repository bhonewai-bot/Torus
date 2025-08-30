import {z} from "zod";

export const productQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    categoryId: z.string().uuid().optional(),
    brand: z.string().optional(),
    isActive: z.boolean().optional(),
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
        .regex(/^[A-Z0-90-_]+$/i, 'SKU can only contain letters, numbers, hyphens, and underscores'),
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
    isActive: z.boolean().default(true),
}).refine(
    (data) => {
        // Comprehensive price validation
        if (data.salePrice && data.regularPrice) {
            if (data.salePrice >= data.regularPrice) {
                return false; // This will trigger the error message
            }
        }
        
        // If sale price exists without regular price
        if (data.salePrice && !data.regularPrice) {
            return false;
        }
        
        return true;
    },
    (data) => {
        // Dynamic error messages based on the specific issue
        if (data.salePrice && data.regularPrice) {
            if (data.salePrice === data.regularPrice) {
                return {
                    message: "Sale price cannot be the same as regular price. Sale price must be lower to offer a discount.",
                    path: ["salePrice"]
                };
            }
            if (data.salePrice > data.regularPrice) {
                return {
                    message: "Sale price cannot be higher than regular price. Please check your pricing.",
                    path: ["salePrice"]
                };
            }
        }
        
        if (data.salePrice && !data.regularPrice) {
            return {
                message: "Regular price is required when setting a sale price.",
                path: ["regularPrice"]
            };
        }
        
        return {
            message: "Invalid price configuration",
            path: ["salePrice"]
        };
    }
);

export const updateProductSchema = z.object({
    sku: z.string()
        .min(1, "SKU is required")
        .max(30, "SKU too long")
        .regex(/^[A-Z0-90-_]+$/i, "SKU can only contain letters, numbers, hyphens, and underscores")
        .optional(),
    title: z.string()
        .min(1, "Title is required")
        .max(100, "Title too long")
        .optional(),
    brand: z.string()
        .max(50, "Brand too long")
        .optional(),
    description: z.string()
        .max(1000, "Description too long")
        .optional(),

    length: z.number().positive("Length must be positive").optional(),
    width: z.number().positive("Width must be positive").optional(),
    height: z.number().positive("Height must be positive").optional(),
    weight: z.number().positive("Weight must be positive").optional(),

    price: z.number().positive("Price must be positive").optional(),
    regularPrice: z.number().positive("Regular price must be positive").optional(),
    salePrice: z.number().positive("Sale price must be positive").optional(),
    taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100").optional(),
    taxIncluded: z.boolean().optional(),

    quantity: z.number().int().min(0, "Quantity must be non-negative").optional(),

    categoryId: z.string().uuid("Invalid category ID").optional(),
    images: z.array(updateProductImageSchema)
        .optional()
        .default([])
        .refine(
            (images) => {
                if (!images.length) return true;
                const mainImage = images.filter((img) => img.isMain);
                return mainImage.length <= 1;
            },
            { message: "Only one image can be marked as main" }
        ),
    isActive: z.boolean().default(true),
}).refine(
    (data) => {
        // Comprehensive price validation
        if (data.salePrice && data.regularPrice) {
            if (data.salePrice >= data.regularPrice) {
                return false; // This will trigger the error message
            }
        }
        
        // If sale price exists without regular price
        if (data.salePrice && !data.regularPrice) {
            return false;
        }
        
        return true;
    },
    (data) => {
        // Dynamic error messages based on the specific issue
        if (data.salePrice && data.regularPrice) {
            if (data.salePrice === data.regularPrice) {
                return {
                    message: "Sale price cannot be the same as regular price. Sale price must be lower to offer a discount.",
                    path: ["salePrice"]
                };
            }
            if (data.salePrice > data.regularPrice) {
                return {
                    message: "Sale price cannot be higher than regular price. Please check your pricing.",
                    path: ["salePrice"]
                };
            }
        }
        
        if (data.salePrice && !data.regularPrice) {
            return {
                message: "Regular price is required when setting a sale price.",
                path: ["regularPrice"]
            };
        }
        
        return {
            message: "Invalid price configuration",
            path: ["salePrice"]
        };
    }
);

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;