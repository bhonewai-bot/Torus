import { Button } from "@/components/ui/button";
import { OrderCard } from "./OrderCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Package, Calendar, FileText } from "lucide-react";
import { formatOrderDate, formatOrderTime } from "../../utils/order.ui.utils";
import { OrderDetail } from "@/features/orders/types/order.types";
import {getOrderStatusBadge, getPaymentStatusBadge} from "./OrderBadge";

interface OrderInfoCardProps {
    order: OrderDetail;
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
    return (
        <OrderCard className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        Order Details
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Copy className="h-4 w-4" />
                        Copy ID
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Order Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <label className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 block">
                            Order Number
                        </label>
                        <div className="font-mono text-lg font-bold text-blue-900 dark:text-blue-100">
                            #{order?.orderNumber}
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <label className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 block">
                            Order Status
                        </label>
                        <div className="mt-1">
                            {getOrderStatusBadge(order.orderStatus)}
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <label className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2 block">
                            Payment Status
                        </label>
                        <div className="mt-1">
                            {getPaymentStatusBadge(order.paymentStatus)}
                        </div>
                    </div>
                </div>

                {/* Order Metrics */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        Order Timeline
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Created: {formatOrderDate(order?.createdAt)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatOrderTime(order?.createdAt)}
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Updated: {formatOrderDate(order?.updatedAt)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatOrderTime(order?.updatedAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Notes */}
                {order?.notes && (
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Order Notes
                        </label>
                        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{order.notes}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </OrderCard>
    )
}