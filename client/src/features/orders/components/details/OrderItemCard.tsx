import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { OrderDetail, OrderItem } from "@/features/orders/types/order.types";
import { formatOrderCurrency } from "@/features/orders/utils/order.ui.utils";

interface OrderItemCardProps {
    order: OrderDetail;
}

export function OrderItemCard({ order }: OrderItemCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Order Items ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {order.items.map((item: OrderItem) => {
                        const priceDifference = item.product.price - item.price;
                        const hasPriceChange = priceDifference !== 0;

                        return (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.productImage}
                                        alt={item.productTitle}
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className={"flex-1 min-w-0"}>
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-medium text-foreground">{item.productTitle}</h3>
                                            <p className="text-muted-foreground mt-1">SKU: {item.productSku}</p>
                                        </div>

                                        <div className="flex flex-col sm:items-end gap-1">
                                            <p className="text-muted-foreground">
                                                {formatOrderCurrency(item.price)} × {item.quantity}
                                            </p>
                                            <p>Subtotal: {formatOrderCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    </div>

                                    {/* Tax Information */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-3 border-t">
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <span>Qty: {item.quantity}</span>
                                            <span>Tax: {formatOrderCurrency(item.taxAmount)}</span>

                                        </div>
                                            Total: {formatOrderCurrency(item.lineTotal)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </CardContent>
        </Card>
    )
}