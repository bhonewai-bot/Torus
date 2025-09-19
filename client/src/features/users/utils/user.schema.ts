import z from "zod";
import { USER_ROLES, USER_STATUSES } from "../types/user.types";

export const userRoleSchema = z.enum(USER_ROLES);
export const userStatusSchema = z.enum(USER_STATUSES);

export const updateUserRoleSchema = z.object({
    role: userRoleSchema
});

export const updateUserStatusSchema = z.object({
    status: userStatusSchema
});

export type updateUserRoleDto = z.infer<typeof updateUserRoleSchema>;
export type updateUserStatusDto = z.infer<typeof updateUserStatusSchema>;