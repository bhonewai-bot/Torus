import {OrderDetail} from "@/features/orders/types/order.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import {formatOrderCurrency} from "@/features/orders/utils/order.ui.utils";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryCardProps {
    order: OrderDetail;
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
    return (
        <Card className={"shadow-none"}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Order Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {formatOrderCurrency(order.subtotal)}
                                </span>
                </div>

                {order.taxAmount && order.taxAmount > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatOrderCurrency(order.taxAmount)}
                                    </span>
                    </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total:</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {formatOrderCurrency(order.total)}
                                </span>
                </div>

                {/* Payment and Order Status */}
                <div className="pt-4 space-y-3">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Payment Status:</span>
                        <div className="mt-1">
                            {/*{getPaymentStatusBadge(order.paymentStatus)}*/}
                        </div>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Order Status:</span>
                        <div className="mt-1">
                            {/*{getOrderStatusBadge(order.orderStatus)}*/}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}