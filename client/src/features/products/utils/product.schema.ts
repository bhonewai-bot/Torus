import {z} from "zod";
import { PRODUCT_STATUSES, ProductStatus } from "../types/product.types";

export const productStatusSchema = z.enum(PRODUCT_STATUSES);

export const productImageSchema = z.union([
    z.object({
        id: z.string().optional(),
        url: z.string().url("Invalid Image URL"),
        isMain: z.boolean().optional(),
    }),
    z.object({
        file: z.instanceof(File),
        isMain: z.boolean().optional(),
    }),
    z.object({
        url: z.string(),
        isMain: z.boolean().optional(),
    }).refine(
        (data) => data.url.startsWith("blob:") || data.url.startsWith("http"),
        "Invalid image URL"
    ),
]);

export const createProductSchema = z.object({
    sku: z.string()
        .min(1, "SKU is required")
        .max(30, "SKU must be less than 30 characters"),
    title: z.string()
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title must be less than 100 characters"),
    description: z.string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),
    categoryId: z.union([z.string().uuid(), z.string()])
        .transform(val => val === "" ? undefined : val)
        .optional(),

    price: z.union([z.string(), z.number()])
        .transform(val => val === "" || val === undefined ? undefined : Number(val))
        .refine(val => val !== undefined && val > 0, {
            message: "Price must be greater than 0"
        }),

    quantity: z.union([z.string(), z.number()])
        .transform(val => val === "" || val === undefined ? 0 : Number(val))
        .refine(val => val >= 0, { 
            message: "Quantity must be 0 or greater" 
        })
        .default(0),

    images: z.array(productImageSchema)
        .optional()
        .default([]),
    status: z.enum(PRODUCT_STATUSES).default("ACTIVE"),
});

export const updateProductSchema = createProductSchema.partial();

export const bulkDeleteProductsSchema = z.object({
    ids: z.array(z.string().uuid()).nonempty("At least one product ID is required")
})

export type createProductFormData = z.infer<typeof createProductSchema>;
export type updateProductFormData = z.infer<typeof updateProductSchema>;

export interface createProductDto {
    sku: string;
    title: string;
    description?: string;
    categoryId?: string;
    price: number;
    quantity: number;
    images: Array<{
        url: string;
        filename?: string;
        originalName?: string;
        size?: number;
        isMain: boolean;
    }>;
    status: ProductStatus;
}

export interface updateProductDto {
    sku?: string;
    title?: string;
    description?: string;
    categoryId?: string;
    price?: number;
    quantity?: number;
    images?: Array<{
        id?: string;
        url: string;
        filename?: string;
        originalName?: string;
        size?: number;
        isMain: boolean;
    }>;
    status?: ProductStatus;
}