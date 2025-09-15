
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, FileText } from "lucide-react";
import { formatOrderCurrency, formatOrderDate, formatOrderTime } from "../../utils/order.ui.utils";
import { OrderDetail } from "@/features/orders/types/order.types";
import {getOrderStatusBadge, getPaymentStatusBadge} from "./OrderBadge";
import { Badge } from "@/components/ui/badge";

interface OrderStatusCardProps {
    order: OrderDetail;
}

export function OrderStatusCard({ order }: OrderStatusCardProps) {
    return (
        <div className="flex justify-between rounded-lg border p-6">
            <h3>
                Order Status
            </h3>
            <div className="space-y-2">
                {/* Order Overview */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Badge>
                            {getOrderStatusBadge(order.orderStatus)}
                        </Badge>
                        <Badge>
                            {getPaymentStatusBadge(order.paymentStatus)}
                        </Badge>
                    </div>
            </div>
        </div>
    )
}