import {OrderDetail} from "@/features/orders/types/order.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface AddressCardProps {
    order: OrderDetail;
}

export function AddressCard({ order }: AddressCardProps) {
    return (
        <Card className={"shadow-none"}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Addresses
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Shipping Address */}
                {order.shippingAddress && (
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Shipping Address
                        </h3>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">
                                {order.shippingAddress}
                            </p>
                        </div>
                    </div>
                )}

                {/* Billing Address */}
                {order.billingAddress && (
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Billing Address
                        </h3>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">
                                {order.billingAddress}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}