import { Button } from "@/components/ui/button";
import { Edit, Printer } from "lucide-react";
import { OrderDetail } from "../../types/order.types";

interface OrderHeaderProps {
    order: OrderDetail;
}

export function OrderHeader({ order }: OrderHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                        Order # {order?.orderNumber}
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Print
                </Button>
                <Button className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Order
                </Button>
            </div>
        </div>
    )
}