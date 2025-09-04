import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {OrderDetail, OrderItem} from "@/features/orders/types/order.types";
import {ShoppingCart, TrendingDown, TrendingUp} from "lucide-react";
import {formatOrderCurrency} from "@/features/orders/utils/order.ui.utils";
import { cn } from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

interface OrderItemCardProps {
    order: OrderDetail;
}

export function OrderItemCard({ order }: OrderItemCardProps) {
    return (
        <Card className={"shadow-none"}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Order Items ({order.items.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {order.items.map((item: OrderItem) => {
                        const priceDifference = item.product.price - item.price;
                        const hasPriceChange = priceDifference !== 0;

                        return (
                            <div key={item.id} className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                        {item.productImage && (
                                            <img
                                                src={item.productImage}
                                                alt={item.productTitle}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.productTitle}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                SKU: {item.productSku}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                {formatOrderCurrency(item.lineTotal)}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Qty: {item.quantity}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Information */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        Unit Price:
                                                    </span>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {formatOrderCurrency(item.price)}
                                                    </span>
                                            {hasPriceChange && (
                                                <div className="flex items-center gap-1">
                                                    {priceDifference > 0 ? (
                                                        <TrendingUp className="h-3 w-3 text-red-500" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3 text-green-500" />
                                                    )}
                                                    <span className={cn(
                                                        "text-xs font-medium",
                                                        priceDifference > 0 ? "text-red-600" : "text-green-600"
                                                    )}>
                                                                {priceDifference > 0 ? "+" : ""}{formatOrderCurrency(priceDifference)}
                                                            </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Current Product Status */}
                                        <div className="flex items-center gap-2">
                                            {/*{item.product.isOnSale && (
                                                <Badge variant="outline" className="text-xs">
                                                    On Sale
                                                </Badge>
                                            )}*/}
                                            <Badge
                                                variant={item.product.isActive ? "outline" : "destructive"}
                                                className="text-xs"
                                            >
                                                {item.product.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Tax Information */}
                                    {item.taxAmount && item.taxAmount > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Tax: {formatOrderCurrency(item.taxAmount)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    )
}