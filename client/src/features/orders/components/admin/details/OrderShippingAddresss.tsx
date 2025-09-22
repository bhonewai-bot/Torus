import { OrderDetail } from "@/features/orders/types/order.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Edit, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderShippingAddresssProps {
    order: OrderDetail;
}

export function OrderShippingAddresss({ order }: OrderShippingAddresssProps) {
    return (
        <Card>
            <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                    <CardTitle>Shipping Address</CardTitle>
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                        <p className="text-[16px] font-medium">{order.user.name}</p>
                        <p className="text-[15px] font-medium text-muted-foreground/80">
                            {/* {order.user.phone} */}+66-800-932-347
                        </p>
                        <p className="text-[15px] font-medium text-muted-foreground/80 mt-2">
                            {order.shippingAddress?.addressLine1}
                            <br />
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state}{" "}
                            {order.shippingAddress?.postalCode}
                            <br />
                            {order.shippingAddress?.country}
                        </p>
                    </div>
                </div>
                
            </CardContent>
        </Card>
    )
}