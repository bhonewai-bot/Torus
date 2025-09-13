import { OrderDetail } from "@/features/orders/types/order.types";
import { OrderCard } from "./OrderCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Receipt, TrendingUp } from "lucide-react";
import { formatOrderCurrency } from "@/features/orders/utils/order.ui.utils";
import { getPaymentStatusBadge, getOrderStatusBadge } from "./OrderBadge";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryCardProps {
    order: OrderDetail;
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
    return (
        <OrderCard>
            <CardHeader>
                <CardTitle>
                    Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Financial Breakdown */}
                <div className="space-y-3">
                    <div className="flex justify-between dark:bg-gray-800 rounded-lg">
                        <span className="text-muted-foreground">
                            Subtotal ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
                        </span>
                        <span>{formatOrderCurrency(order.subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className={"text-muted-foreground"}>Tax</span>
                        <span>
                            {formatOrderCurrency(order.taxAmount ?? 0)}
                        </span>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>
                        {formatOrderCurrency(order.total)}
                    </span>
                </div>
            </CardContent>
        </OrderCard>
    )
}