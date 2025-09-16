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
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
            icon: Clock,
            label: "Pending",
        },
        PAID: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
            icon: Check,
            label: "Paid",
        },
        FAILED: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
            icon: X,
            label: "Failed",
        },
        REFUNDED: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
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
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
            icon: Clock,
            label: "Pending",
        },
        CONFIRMED: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
            icon: Clock,
            label: "Confirmed",
        },
        PROCESSING: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
            icon: Clock,
            label: "Processing",
        },
        SHIPPED: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
            icon: Package,
            label: "Shipped",
        },
        DELIVERED: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
            icon: Package,
            label: "Delivered",
        },
        CANCELED: {
            variant: "outline" as const,
            className: "border-none px-[9px] py-[5px] rounded-md font-semibold bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
            icon: X,
            label: "Canceled",
        }
    }

    return config[status as keyof typeof config] || config.PENDING;
}

export const getUserInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}