import { OrderDetail } from "@/features/orders/types/order.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { getPaymentStatusBadge } from "./OrderBadge";
import { formatOrderDate, formatOrderTime } from "@/lib/utils/format.utils";

interface OrderSummaryCardProps {
    order: OrderDetail;
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
    return (
        <Card>
            <CardHeader className="pb-6">
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-[15px] font-medium text-muted-foreground/80 mb-1">
                                Customer
                            </p>
                            <p className="text-[16px] font-medium">{order.user.name}</p>
                            <div className="flex items-center gap-2 text-[15px] font-medium text-muted-foreground/80 mb-1">
                                <Mail className="w-3 h-3" />
                                <span>{order.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[15px] font-medium text-muted-foreground/80">
                                <Phone className="w-3 h-3" />
                                <span>{/* {order.user.phone} */}+66-800-932-347</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[15px] font-medium text-muted-foreground/80 mb-1">
                                Order Date
                            </p>
                            <p className="text-[16px] font-medium">{formatOrderDate(order.createdAt)} at {formatOrderTime(order.createdAt)}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[15px] font-medium text-muted-foreground/80 mb-1">
                                Payment Method
                            </p>
                            <p className="text-[16px] font-medium" >{order.payments?.[0]?.method}</p>
                            <div className="mt-1">
                                {getPaymentStatusBadge(order.payments?.[0]?.status ?? undefined)}
                            </div>
                        </div>
                        {/* <div>
                            <p className="text-sm text-muted-foreground mb-1">
                                Shipping
                            </p>
                            <p>{order.shippingMethod}</p>
                            <p className="text-sm text-muted-foreground">
                                Tracking: {orderData.trackingNumber}
                            </p>
                        </div> */}
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}