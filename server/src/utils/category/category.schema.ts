import {z} from "zod";

export const createCategorySchema = z.object({
    title: z.string().min(1, "Category is required"),
});

export const updateCategorySchema = createCategorySchema.partial();

export type createCategoryDto = z.infer<typeof createCategorySchema>;
export type updateCategoryDto = z.infer<typeof updateCategorySchema>;