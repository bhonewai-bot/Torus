import { userKeys } from "../lib/user.query.keys";

export const userUpdateConfigs = {
    role: {
        queryKeys: userKeys,
        successMessage: "User role updated successfully",
        listDataPath: "users",
        mutationKey: "updateUserRole"
    },
    status: {
        queryKeys: userKeys,
        successMessage: "User status updated successfully",
        listDataPath: "users",
        mutationKey: "updateUserStatus"
    }
} as const;