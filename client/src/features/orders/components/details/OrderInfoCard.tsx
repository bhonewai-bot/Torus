import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Package } from "lucide-react";
import {formatOrderDate, formatOrderTime} from "../../utils/order.ui.utils";
import {OrderDetail} from "@/features/orders/types/order.types";

interface OrderInfoCardProps {
    order: OrderDetail;
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
    return (
        <Card className="lg:col-span-2 shadow-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Information
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Order Number & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Order Number
                        </label>
                        <div className="mt-1 font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">
                            #{order?.orderNumber}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Order Status
                        </label>
                        <div className="mt-2">
                            {/* {getOrderStatusBadge(order.orderStatus)} */}
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Payment Status
                        </label>
                        <div className="mt-2">
                            {/* {getPaymentStatusBadge(order.paymentStatus)} */}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Items
                        </label>
                        <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {order?.totalQuantity} items ({order?.itemCount} products)
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Order Date
                        </label>
                        <div className="mt-1 space-y-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                {formatOrderDate(order?.createdAt)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                at {formatOrderTime(order?.createdAt)}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Last Updated
                        </label>
                        <div className="mt-1 space-y-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                {formatOrderDate(order?.updatedAt)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                at {formatOrderTime(order?.updatedAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {order?.notes && (
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Order Notes
                        </label>
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">{order.notes}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}