import { Ban, Shield, UserCheck } from "lucide-react"

export const formatUserDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}

export const getUserStatusConfig = (status: string) => {
    const config = {
        ACTIVE: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
            icon: UserCheck,
            label: "Active",
        },
        BANNED: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
            icon: Ban,
            label: "Banned",
        },
    }

    return config[status as keyof typeof config] || config.ACTIVE;
}

export const getUserRoleConfig = (role: string) => {
    const config = {
        ADMIN: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
            icon: Shield,
            label: "Admin",
        },
        USER: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
            icon: null,
            label: "User",
        },
    }

    return config[role as keyof typeof config] || config.USER;
}