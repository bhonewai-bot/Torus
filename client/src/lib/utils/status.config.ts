import { Ban, Check, Clock, Package, Shield, UserCheck, X } from "lucide-react";

interface BadgeConfig {
    variant: "outline";
    className: string;
    icon: any;
    label: string;
}

const colorVariants = {
    green: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    yellow: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    red: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    blue: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    purple: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
} as const;

export const getUserStatusConfig = (status: string): BadgeConfig => {
    const configs = {
        ACTIVE: {
            variant: "outline" as const,
            className: colorVariants.green,
            icon: UserCheck,
            label: "Active",
        },
        BANNED: {
            variant: "outline" as const,
            className: colorVariants.red,
            icon: Ban,
            label: "Banned",
        },
    };
    return configs[status as keyof typeof configs] || configs.ACTIVE;
};

export const getUserRoleConfig = (role: string): BadgeConfig => {
    const configs = {
        ADMIN: {
            variant: "outline" as const,
            className: colorVariants.purple,
            icon: Shield,
            label: "Admin",
        },
        USER: {
            variant: "outline" as const,
            className: colorVariants.blue,
            icon: null,
            label: "User",
        },
    };
    return configs[role as keyof typeof configs] || configs.USER;
};

export const getOrderStatusConfig = (status: string): BadgeConfig => {
    const configs = {
        PENDING: {
            variant: "outline" as const,
            className: colorVariants.yellow,
            icon: Clock,
            label: "Pending",
        },
        CONFIRMED: {
            variant: "outline" as const,
            className: colorVariants.blue,
            icon: Clock,
            label: "Confirmed",
        },
        PROCESSING: {
            variant: "outline" as const,
            className: colorVariants.yellow,
            icon: Clock,
            label: "Processing",
        },
        SHIPPED: {
            variant: "outline" as const,
            className: colorVariants.purple,
            icon: Package,
            label: "Shipped",
        },
        DELIVERED: {
            variant: "outline" as const,
            className: colorVariants.green,
            icon: Package,
            label: "Delivered",
        },
        CANCELED: {
            variant: "outline" as const,
            className: colorVariants.red,
            icon: X,
            label: "Canceled",
        }
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
};

export const getPaymentStatusConfig = (status: string): BadgeConfig => {
    const configs = {
        PENDING: {
            variant: "outline" as const,
            className: colorVariants.yellow,
            icon: Clock,
            label: "Pending",
        },
        PAID: {
            variant: "outline" as const,
            className: colorVariants.green,
            icon: Check,
            label: "Paid",
        },
        FAILED: {
            variant: "outline" as const,
            className: colorVariants.red,
            icon: X,
            label: "Failed",
        },
        REFUNDED: {
            variant: "outline" as const,
            className: colorVariants.purple,
            icon: X,
            label: "Refunded",
        },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
};