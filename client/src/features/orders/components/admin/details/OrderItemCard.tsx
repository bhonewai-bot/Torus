import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderDetail, OrderItem } from "@/features/orders/types/order.types";
import { formatCurrency } from "@/lib/utils/format.utils";

interface OrderItemCardProps {
    order: OrderDetail;
}

// Simple image component with fallback
function ImageWithFallback({ 
    src, 
    alt, 
    className 
}: { 
    src?: string; 
    alt: string; 
    className?: string; 
}) {
    return (
        <img
            src={src || '/placeholder-image.jpg'} // Add your placeholder image path
            alt={alt}
            className={className}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg'; // Fallback image
            }}
        />
    );
}

export function OrderItemCard({ order }: OrderItemCardProps) {
    return (
        <Card>
            <CardHeader className="pb-6">
                <CardTitle>
                    Products ({order.items.length} items) 
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
                <div className="space-y-6">
                    {order.items.map((item: OrderItem, index) => (
                        <div 
                            key={item.id}
                            className={`flex gap-4 ${index !== order.items.length - 1 ? "pb-6 border-b border-muted/30" : ""}`}
                        >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <ImageWithFallback
                                    src={item.productImage}
                                    alt={item.productTitle}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-medium">
                                            {item.productTitle}
                                        </h4>
                                        <p className="text-sm font-medium text-muted-foreground/80">
                                            SKU: {item.productSku}
                                        </p>
                                        <p className="text-sm font-medium text-muted-foreground/80">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {formatCurrency(item.unitPrice)}
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatCurrency(item.lineTotal)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-muted/30">
                    <div className="space-y-3 max-w-sm ml-auto">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground/80">
                                Subtotal
                            </span>
                            <span>
                                {formatCurrency(order.pricing.subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground/80">
                                Tax
                            </span>
                            <span>
                                {formatCurrency(order.pricing.taxAmount)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground/80">
                                Shipping
                            </span>
                            <span>
                                {formatCurrency(order.pricing.shippingAmount)}
                            </span>
                        </div>
                        {order.pricing.discountAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Discount
                                </span>
                                <span className="text-green-600">
                                    -{formatCurrency(order.pricing.discountAmount)}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-muted/30 font-medium">
                            <span>Total</span>
                            <span>
                                {formatCurrency(order.pricing.total)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}