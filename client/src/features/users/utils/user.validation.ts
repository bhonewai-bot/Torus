import { is } from "zod/v4/locales";
import { UserList } from "../types/user.types";

export const validateUserOperation = (
    user: UserList,
    operation: "PROMOTE" | "DEMOTE" | "BAN" | "UNBAN",
    currentUserId?: string
) => {
    const validations = {
        PROMOTE: [
            {
                condition: user.status === "BANNED",
                message: "Cannot promote banned user to admin",
            },
        ],
        DEMOTE: [
            /* {
                condition: user.id === currentUserId,
                message: "Cannot demote your own admin privileges",
            } */
        ],
        BAN: [
            {
                condition: user.role === "ADMIN",
                message: "Cannot ban admin user. Remove admin role first.",
            },
            /* {
                condition: user.id === currentUserId,
                message: "Cannot ban yourself"
            } */
        ],
        UNBAN: [
            {
                condition: user.role === "ADMIN" && user.status === "BANNED",
                message: "Admin users should not be in banned state. Contact system administrator."
            }
        ],
    }

    const operationValidations = validations[operation];
    for (const validation of operationValidations) {
        if (validation.condition) {
            return { isValid: false, message: validation.message };
        }
    }

    return { isValid: true };
}