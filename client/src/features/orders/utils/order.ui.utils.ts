import { Check, Clock, Package, X } from "lucide-react";

export const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export const formatOrderTime = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

export const formatOrderCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "THB",
        minimumFractionDigits: 2,
    }).format(amount);
}

export const getPaymentStatusConfig = (status: string) => {
    const config = {
        PENDING: {
            variant: "outline" as const,
            className: "rounded-full bg-amber-100 text-amber-600 border-[1px] border-amber-300/50 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-300/30",
            icon: Clock,
            label: "Pending",
        },
        PAID: {
            variant: "outline" as const,
            className: "rounded-full bg-green-100 text-green-800 border-[1px] border-green-300/50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-300/30",
            icon: Check,
            label: "Paid",
        },
        FAILED: {
            variant: "outline" as const,
            className: "rounded-full bg-red-100 text-red-800 border-[1px] border-red-300/50 dark:bg-red-900/20 dark:text-red-200 dark:border-red-300/30",
            icon: X,
            label: "Failed",
        },
        REFUNDED: {
            variant: "outline" as const,
            className: "rounded bg-purple-100 text-purple-800 border-[1px] border-purple-300/50 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-300/30",
            icon: X,
            label: "Refunded",
        },
    }

    return config[status as keyof typeof config] || config.PENDING;
}

export const getOrderStatusConfig = (status: string) => {
    const config = {
        PENDING: {
            variant: "outline" as const,
            className: "rounded-full bg-amber-100 text-amber-600 border-[1px] border-amber-300/50 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-300/30",
            icon: Clock,
            label: "Pending",
        },
        CONFIRMED: {
            variant: "outline" as const,
            className: "rounded-full bg-green-100 text-green-800 border-[1px] border-green-300/50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-300/30",
            icon: Clock,
            label: "Confirmed",
        },
        PROCESSING: {
            variant: "outline" as const,
            className: "rounded-full bg-amber-100 text-amber-600 border-[1px] border-amber-300/50 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-300/30",
            icon: Clock,
            label: "Processing",
        },
        SHIPPED: {
            variant: "outline" as const,
            className: "rounded bg-purple-100 text-purple-800 border-[1px] border-purple-300/50 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-300/30",
            icon: Package,
            label: "Shipped",
        },
        DELIVERED: {
            variant: "outline" as const,
            className: "rounded-full bg-green-100 text-green-800 border-[1px] border-green-300/50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-300/30",
            icon: Package,
            label: "Delivered",
        },
        CANCELED: {
            variant: "outline" as const,
            className: "rounded-full bg-red-100 text-red-800 border-[1px] border-red-300/50 dark:bg-red-900/20 dark:text-red-200 dark:border-red-300/30",
            icon: X,
            label: "Canceled",
        }
    }

    return config[status as keyof typeof config] || config.PENDING;
}

export const getUserInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}