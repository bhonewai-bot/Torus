import {z} from "zod";

export const createProductSchema = z.object({
    name: z.string(),
    sku: z.string(),
    description: z.string().optional(),
    price: z.coerce.number(),
    categories: z.preprocess((val) => {
        if (typeof val === 'string') {
            return val.split(',');
        }
        return val;
    }, z.array(z.string())).optional(),
    images: z.preprocess((val) => {
        if (typeof val === 'string') {
            return val.split(',');
        }
    }, z.array(z.string())).optional(),
    quantity: z.coerce.number(),
});

export const updateProductSchema = z.object({
    name: z.string().optional(),
    sku: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    categories: z.preprocess((val) => {
        if (typeof val === 'string') {
            return val.split(',');
        }
    }, z.array(z.string())).optional(),
    images: z.preprocess((val) => {
        if (typeof val === 'string') {
            return val.split(',');
        }
    }, z.array(z.string())).optional(),
    quantity: z.coerce.number().optional(),
});

export const addProductImagesSchema = z.object({
    images: z.preprocess((val) => {
        if (typeof val === 'string') {
            return val.split(',');
        }
    }, z.array(z.string())),
});

export const postgresIdPathSchema = z.object({
    id: z.string().uuid(),
});

export const paginationQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
});