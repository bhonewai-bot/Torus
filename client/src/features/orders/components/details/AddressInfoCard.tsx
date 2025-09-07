import { OrderDetail } from "@/features/orders/types/order.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface AddressCardProps {
    order: OrderDetail;
}

export function AddressInfoCard({ order }: AddressCardProps) {
    return (
        <Card>
            {/*<CardHeader>
                <CardTitle>
                    Delivery Information
                </CardTitle>
            </CardHeader>*/}
            <CardContent className="space-y-6">
                {/* Shipping Address */}
                {order.shippingAddress && (
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                Shipping Address
                            </h3>
                        </div>
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {order.shippingAddress}
                            </p>
                        </div>
                    </div>
                )}

                {/* Billing Address */}
                {order.billingAddress && (
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                Billing Address
                            </h3>
                        </div>
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {order.billingAddress}
                            </p>
                        </div>
                    </div>
                )}

                {!order.shippingAddress && !order.billingAddress && (
                    <div className="text-center py-8">
                        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No address information available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}