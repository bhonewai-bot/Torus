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
            className: "border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-950",
            icon: Clock,
            label: "Pending",
        },
        PAID: {
            variant: "outline" as const,
            className: "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950",
            icon: Check,
            label: "Paid",
        },
        FAILED: {
            variant: "outline" as const,
            className: "border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950",
            icon: X,
            label: "Failed",
        },
        REFUNDED: {
            variant: "outline" as const,
            className: "border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950",
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
            className: "border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-950",
            icon: Clock,
            label: "Pending",
        },
        CONFIRMED: {
            variant: "outline" as const,
            className: "border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-950",
            icon: Clock,
            label: "Confirmed",
        },
        PROCESSING: {
            variant: "outline" as const,
            className: "border-amber-200 text-amber-500 bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-950",
            icon: Clock,
            label: "Processing",
        },
        SHIPPED: {
            variant: "outline" as const,
            className: "border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:bg-purple-950",
            icon: Package,
            label: "Shipped",
        },
        DELIVERED: {
            variant: "outline" as const,
            className: "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950",
            icon: Package,
            label: "Delivered",
        },
        CANCELED: {
            variant: "outline" as const,
            className: "border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950",
            icon: X,
            label: "Canceled",
        }
    }

    return config[status as keyof typeof config] || config.PENDING;
}

export const getUserInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}