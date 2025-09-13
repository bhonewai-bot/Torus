import {ReactNode, use} from "react";
import {ColumnDef} from "@tanstack/table-core";
import {OrderList} from "@/features/orders/types/order.types";
import {Checkbox} from "@/components/ui/checkbox";
import {useConfirmDialog} from "@/hooks/useConfirmDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Edit, Eye, MoreHorizontal, Trash2} from "lucide-react";
import {toast} from "sonner";
import {cn} from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {getOrderStatusBadge, getPaymentStatusBadge} from "@/features/orders/components/details/OrderBadge";
import Link from "next/link";

type TableHeaderCellProps = {
    children: ReactNode;
    className?: string;
}

export function TableHeaderCell({ children }: TableHeaderCellProps) {
    return (
        <div className="text-[15px] font-normal">
            {children}
        </div>
    );
}

function OrderCell({ order }: { order: any }) {
    return (
        <Link
            href={`/admin/orders/${order.id}`}
            className="truncate font-normal text-primary dark:text-primary hover:underline"
        >
            #{order.orderNumber}
        </Link>
    )
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

export const columns: ColumnDef<OrderList>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label={"Select all orders"}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label={"Select row"}
            />
        )
    },
    {
        accessorKey: "orderNumber",
        header: () => <TableHeaderCell>Order</TableHeaderCell>,
         cell: ({ row }) => <OrderCell order={row.original} />
    },
    {
        accessorKey: "createdAt",
        header: () => <TableHeaderCell>Date</TableHeaderCell>,
        cell: ({ row }) => {
            const dateString = row.getValue("createdAt") as string;
            const formattedDate = formatDate(dateString);

            return (
                <div>
                    {formattedDate}
                </div>
            )
        }
    },
    {
        accessorKey: "user.name",
        header: () => <TableHeaderCell>Customer</TableHeaderCell>,
        cell: ({ row }) => {
            const user = row.original.user;
            const initials = use.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                        <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <Link href={`/admin/users/${user.id}`}
                                className="truncate font-normal hover:underline">
                            {user.name}
                        </Link>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "paymentStatus",
        header: () => <TableHeaderCell>Payment</TableHeaderCell>,
        cell: ({ row }) => {
            const status = row.getValue("paymentStatus") as string;

            return (
                <div>{getPaymentStatusBadge(status)}</div>
            )
        }
    },
    {
        accessorKey: "orderStatus",
        header: () => <TableHeaderCell>Order Status</TableHeaderCell>,
        cell: ({ row }) => {
            const status = row.getValue("orderStatus") as string;

            return (
                <div>{getOrderStatusBadge(status)}</div>
            )
        }
    },
    {
        accessorKey: "total",
        header: () => <TableHeaderCell>Total</TableHeaderCell>,
        cell: ({ row }) => {
            const total = parseFloat(row.getValue("total"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "THB",
            }).format(total)

            return <div>{formatted}</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { confirm } = useConfirmDialog();

            const handleCopyId = async () => {
                try {
                    await navigator.clipboard.writeText(order.id);
                    toast.success("Order ID copied to clipboard");
                } catch (error) {
                    console.error("Failed to copy:", error);
                    toast.error("Failed to copy order ID");
                }
            }

            const handleView = () => {
                window.location.href = `/admin/orders/${order.id}`;
            }

            /*const handleEdit = () => {
                window.location.href = `/admin/orders/${order.id}/edit`;
            }*/

            return (
                <div className={"text-right"}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} className={"h-8 w-8 p-0"}>
                                <span className={"sr-only"}>Open menu</span>
                                <MoreHorizontal className={"h-4 w-4"} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={"end"}>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={handleCopyId}>
                                Copy order ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleView}>
                                <Eye className={"mr-2 h-4 w-4"} />
                                View order
                            </DropdownMenuItem>
                            {/*<DropdownMenuItem onClick={handleEdit}>
                                <Edit className={"mr-2 h-4 w-4"} />
                                Edit order
                            </DropdownMenuItem>*/}
                            <DropdownMenuItem
                                disabled
                                className={"text-destructive focus:text-destructive"}
                            >
                                <Trash2 className={"mr-2 h-4 w-4"} />
                                Delete product
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    }
]