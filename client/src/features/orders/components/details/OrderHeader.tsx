import { Button } from "@/components/ui/button";
import { Download, Edit, Printer, RefreshCw } from "lucide-react";
import { ORDER_STATUSES, OrderDetail, OrderStatus } from "../../types/order.types";
import { getOrderStatusBadge } from "./OrderBadge";
import { Select } from "@radix-ui/react-select";
import { useState } from "react";
import { useUpdateOrderStatus } from "../../hooks/useOrders";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrderStatusConfig } from "../../utils/order.ui.utils";

interface OrderHeaderProps {
    order: OrderDetail;
}

export function OrderHeader({ order }: OrderHeaderProps) {
    const [status, setStatus] = useState({
        orderStatus: order.orderStatus
    });

    const { mutate, isPending } = useUpdateOrderStatus(order.id);
    
    const handleStatusChange = (field: "orderStatus", value: string) => {
        setStatus((prev) => ({ ...prev, [field]: value }));

        mutate({ [field]: value }, {
            onError: (error) => {
                // Revert the optimistic update on error
                setStatus((prev) => ({
                    ...prev,
                    [field]: order[field]
                }));
                console.error('Failed to update order status:', error);
            }
        });
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex justify-center items-center gap-4">
                    <h1 className="text-3xl font-medium">
                        Order # {order?.orderNumber}
                    </h1>
                    {getOrderStatusBadge(order.orderStatus)}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Select
                    value={status.orderStatus}
                    // defaultValue={order.paymentStatus}
                    onValueChange={(value: OrderStatus) => handleStatusChange("orderStatus", value)}
                >
                    <SelectTrigger className={"w-full h-4"} size="default">
                        <SelectValue placeholder={order.orderStatus} />
                    </SelectTrigger>
                    <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                                {getOrderStatusConfig(status).label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Invoice
                </Button>
                <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refund
                </Button>
            </div>
        </div>
    )
}