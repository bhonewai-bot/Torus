import {
    ORDER_STATUSES,
    OrderDetail,
    OrderStatus,
    PAYMENT_STATUSES,
    PaymentStatus
} from "@/features/orders/types/order.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getOrderStatusConfig, getPaymentStatusConfig} from "@/features/orders/utils/order.ui.utils";
import {useUpdateOrderStatus} from "@/features/orders/hooks/useOrders";
import {useState} from "react";

interface OrderStatusCardProps {
    order: OrderDetail;
}

export function OrderStatusCard({ order}: OrderStatusCardProps) {
    const [status, setStatus] = useState({
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus
    })

    const { mutate, isPending } = useUpdateOrderStatus(order.id);
    
    const handleStatusChange = (field: "paymentStatus" | "orderStatus", value: string) => {
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
        <Card>
            <CardHeader>
                <CardTitle>
                    Order Status
                </CardTitle>
            </CardHeader>
            <CardContent className={"space-y-6"}>
                {/* Payment Status */}
                <div className={"relative"}>
                    <div className="mb-2">
                        <h3 className={"font-medium"}>
                            Payment status
                        </h3>
                    </div>
                    <Select
                        value={status.paymentStatus}
                        /* defaultValue={order.paymentStatus} */
                        onValueChange={(value: PaymentStatus) => handleStatusChange("paymentStatus", value)}
                    >
                        <SelectTrigger className={"w-full"}>
                            <SelectValue placeholder={order.paymentStatus} />
                        </SelectTrigger>
                        <SelectContent>
                            {PAYMENT_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {getPaymentStatusConfig(status).label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Order Status */}
                <div className={"relative"}>
                    <div className="mb-2">
                        <h3 className={"font-medium"}>
                            Order status
                        </h3>
                    </div>
                    <Select
                        value={status.orderStatus}
                        onValueChange={(value: OrderStatus) => handleStatusChange("orderStatus", value)}
                    >
                        <SelectTrigger className={"w-full"}>
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
                </div>
            </CardContent>
        </Card>
    )
}