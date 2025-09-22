import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getOrderStatusBadge } from "@/features/orders/components/admin/details/OrderBadge";
import { UserDetail } from "@/features/users/types/user.types";
import { formatCurrency, formatOrderDate } from "@/lib/utils/format.utils";
import { Eye, FileText, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserOrderListCardProps {
    user: UserDetail;
}

export function UserOrderListCard({ user }: UserOrderListCardProps) {
    const router = useRouter();

    const onViewOrder = (orderId: string) => {
        router.push(`/admin/orders/${orderId}`);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        Oders
                    </CardTitle>
                    {/* {user.orders?.length > 5 && (
                        <Button size={"sm"} variant={"outline"}>
                            View All
                        </Button>
                    )} */}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-6 bg-muted/10 border-b border-muted/30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-semibold">{user.orders.length}</p>
                            <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">
                                ${user.orders.reduce((total, order) => total + order.total, 0).toFixed(2)}
                            </p>
                            <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">
                                {user.orders.filter(o => o.orderStatus.toLowerCase() === 'delivered').length}
                            </p>
                            <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">
                                {user.orders.filter(o => ['PENDING', 'PROCESSING', 'SHIPPED'].includes(o.orderStatus)).length}
                            </p>
                            <p className="text-sm font-medium text-muted-foreground">Active</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-0">
                    {user.orders?.map((order, index) => (
                        <div
                            key={order.id}
                            className={`p-6 ${index !== user.orders.length - 1 ? 'border-b border-muted/30' : ''}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h4 className="font-medium">#{order.orderNumber}</h4>
                                        {getOrderStatusBadge(order.orderStatus)}
                                    </div>

                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p className="font-medium text-muted-foreground/80">{formatOrderDate(order.createdAt)}</p>
                                        <p>
                                        {/* {order} {order.itemCount === 1 ? 'item' : 'items'} •  */}
                                            <span className="text-sm font-medium">
                                                {formatCurrency(order.total)}
                                            </span>
                                        </p>
                                        {user.addresses && (
                                            <p className="truncate font-medium text-muted-foreground/80 max-w-md">{user.addresses.map(a => a.addressLine1)}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <Button
                                        onClick={() => onViewOrder(order.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        // onClick={() => onViewInvoice(order.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="h-8 w-8 p-0 bg-transparent border-0 rounded-md hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onViewOrder(order.id)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem /* onClick={() => onViewInvoice(order.id)} */>
                                                <FileText className="w-4 h-4 mr-2" />
                                                Download Invoice
                                            </DropdownMenuItem>
                                            {/* {canRefund(order.status) && (
                                                <DropdownMenuItem 
                                                onClick={() => onRefundOrder(order.id)}
                                                className="text-destructive"
                                                >
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Process Refund
                                                </DropdownMenuItem>
                                            )} */}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}