"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useUpdateOrderStatus } from "@/features/orders/hooks/useOrders";
import { OrderDetail, ORDER_STATUSES, OrderStatus } from "@/features/orders/types/order.types";

interface OrderStatusUpdateDialogProps {
    order: OrderDetail;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

export function OrderStatusUpdateDialog({ order, isOpen, onOpenChange, children }: OrderStatusUpdateDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.orderStatus);
    const [error, setError] = useState("");
    const { mutate: updateOrderStatus, isPending } = useUpdateOrderStatus(order.id);

    const dialogOpen = isOpen !== undefined ? isOpen : internalOpen;
    const setDialogOpen = onOpenChange || setInternalOpen;

    const handleSubmit = () => {
        if (orderStatus === order.orderStatus) {
            setDialogOpen(false);
            return;
        }

        setError("");

        updateOrderStatus(
            { orderStatus },
            {
                onSuccess: () => {
                    setDialogOpen(false);
                    setError("");
                },
                onError: (error: any) => {
                    setError(error.message || "Failed to update order status");
                }
            }
        );
    };

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setOrderStatus(order.orderStatus);
            setError("");
        }
    }

    const handleStatusChange = (value: OrderStatus) => {
        setOrderStatus(value);
        if (error) setError(""); 
    };

    const getStatusLabel = (status: OrderStatus): string => {
        switch (status) {
            case "PENDING":
                return "Pending";
            case "CONFIRMED":
                return "Confirmed";
            case "PROCESSING":
                return "Processing";
            case "SHIPPED":
                return "Shipped";
            case "DELIVERED":
                return "Delivered";
            case "CANCELED":
                return "Canceled";
            default:
                return status;
        }
    };

    if (children) {
        return (
            <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
                <DialogContent>
                    {/* Same dialog content */}
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                                Order #{order.orderNumber}
                            </div>
                            <Select
                                value={orderStatus}
                                onValueChange={handleStatusChange}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select order status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ORDER_STATUSES.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {getStatusLabel(status)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                disabled={isPending}
                                className="flex-0"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isPending || orderStatus === order.orderStatus}
                                className="flex-0"
                            >
                                {isPending ? "Updating..." : "Update Status"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {/* <DialogTrigger asChild>
                {children || (
                    <button className="font-medium hover:underline text-[13px] text-primary">
                        Update Status
                    </button>
                )}
            </DialogTrigger> */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                            Order #{order.orderNumber}
                        </div>
                        <Select
                            value={orderStatus}
                            onValueChange={handleStatusChange}
                            disabled={isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select order status" />
                            </SelectTrigger>
                            <SelectContent>
                                {ORDER_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {getStatusLabel(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={isPending}
                            className="flex-0"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending || orderStatus === order.orderStatus}
                            className="flex-0"
                        >
                            {isPending ? "Updating..." : "Update Status"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}