import {z} from "zod";

export const createCategorySchema = z.object({
    title: z.string().min(1, "Category is required")
});

export type createCategoryDto = z.infer<typeof createCategorySchema>;