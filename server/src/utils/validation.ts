import {z} from "zod";

// Common
export const postgresIdPathSchema = z.object({
    id: z.string().uuid(),
});