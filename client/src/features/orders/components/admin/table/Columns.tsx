import {ReactNode} from "react";
import {ColumnDef} from "@tanstack/table-core";
import {Order} from "@/features/orders/types/order.types";
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

type TableHeaderCellProps = {
    children: ReactNode;
}

export function TableHeaderCell({ children }: TableHeaderCellProps) {
    return (
        <div className="text-[15px] font-medium text-foreground">
            {children}
        </div>
    );
}

export const columns: ColumnDef<Order>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label={"Select all"}
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
        accessorKey: "items.products.title",
        header: () => <TableHeaderCell>Product</TableHeaderCell>
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
        accessorKey: "user.name",
        header: () => <TableHeaderCell>Customer</TableHeaderCell>
    },
    {
        accessorKey: "status",
        header: () => <TableHeaderCell>Status</TableHeaderCell>
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

            const handleEdit = () => {
                window.location.href = `/admin/orders/${order.id}/edit`;
            }

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
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className={"mr-2 h-4 w-4"} />
                                Edit order
                            </DropdownMenuItem>
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