import z, { email } from "zod";

export const userRoleSchema = z.enum([
    "ADMIN",
    "USER",
]);

export const userStatusSchema = z.enum([
    "ACTIVE",
    "BANNED",
])

export const userQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(-1).max(1000).default(10),
    name: z.string().optional(),
    email: z.string().email().optional(),
    role: userRoleSchema.default("USER"),
    status: userStatusSchema.default("ACTIVE"),
    search: z.string().optional(),
    sortBy: z.enum(["name", "email", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

/* export const createUserSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial();
export type createUserDto = z.infer<typeof createUserSchema>;
export type updateUserDto = z.infer<typeof updateUserSchema>; */

export const updateUserRoleSchema = z.object({
    role: userRoleSchema,
});

export const updateUserStatusSchema = z.object({
    status: userStatusSchema,
})


export type updateUserRoleDto = z.infer<typeof updateUserRoleSchema>;
export type updateUserStatusDto = z.infer<typeof updateUserStatusSchema>;