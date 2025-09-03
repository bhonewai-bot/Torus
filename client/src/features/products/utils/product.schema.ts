import {z} from "zod";

const emptyToUndefined = (val: unknown) => val === "" ? undefined : Number(val);

export const productImageSchema = z.union([
    z.object({
        url: z.string().url("Invalid Image URL"),
        isMain: z.boolean().optional(),
    }),
    z.object({
        file: z.instanceof(File),
        isMain: z.boolean().optional(),
    })
]);

export const createProductSchema = z.object({
    sku: z.string()
        .min(1, "SKU is required")
        .max(30, "SKU must be less than 30 characters"),
    title: z.string()
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title must be less than 100 characters"),
    brand: z.string()
        .max(50, "Brand must be less than 50 characters")
        .optional(),
    description: z.string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),
    categoryId: z.union([z.string().uuid(), z.string()])
        .transform(val => val === "" ? undefined : val)
        .optional(),

    dimensions: z.object({
        length: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
        width: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
        height: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
        weight: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
    }).optional(),

    pricing: z.object({
        price: z.union([z.string(), z.number()])
            .transform(val => val === "" ? undefined : Number(val))
            .refine(val => val !== undefined && val > 0, {
                message: "Price must be greater than 0"
            }),
        regularPrice: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
        salePrice: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
        taxRate: z.union([z.string(), z.number()])
            .transform(val => val === "" ? undefined : Number(val))
            .optional()
            .refine(val => val === undefined || (val >= 0 && val <= 100), {
                message: "Tax rate must be between 0 and 100",
            }),
        taxIncluded: z.boolean().optional(),
    }),

    inventory: z.object({
        quantity: z.union([z.string(), z.number()])
            .transform(val => Number(val))
            .refine(val => val >= 1, { message: "Quantity must be at least 1" }),
    }),

    images: z.array(productImageSchema)
        .optional()
        .default([]),
    isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type createProductFormData = z.infer<typeof createProductSchema>;
export type updateProductFormData = z.infer<typeof updateProductSchema>;
export type createProductDto = createProductFormData;
export type updateProductDto = updateProductFormData;