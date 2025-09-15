import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { OrderDetail, OrderItem } from "@/features/orders/types/order.types";
import { formatOrderCurrency } from "@/features/orders/utils/order.ui.utils";

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
            <CardHeader>
                <CardTitle>
                    Order Items ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16"></TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Tax</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item: OrderItem) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <ImageWithFallback
                                            src={item.productImage}
                                            alt={item.productTitle}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="font-medium">{item.productTitle}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-muted px-2 py-1 rounded">
                                            {item.productSku}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatOrderCurrency(item.price)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatOrderCurrency(item.taxAmount ?? 0)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatOrderCurrency(item.lineTotal)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <Separator className="my-4" />
                
                {/* Order Totals */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatOrderCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>{formatOrderCurrency(order.taxAmount ?? 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span>Total</span>
                        <span>{formatOrderCurrency(order.total)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}