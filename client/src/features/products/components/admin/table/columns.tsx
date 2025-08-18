"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ColumnDef} from "@tanstack/table-core";
import {Edit, Eye, MoreHorizontal, Trash2} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {ReactNode} from "react";
import {Product} from "@/features/products/types/product.types";
import {useDeleteProduct} from "@/features/products/hooks/useProducts";
import {useConfirmDialog} from "@/hooks/useConfirmDialog";
import {toast} from "sonner";

type TableHeaderCellProps = {
    children: ReactNode;
};

export function TableHeaderCell({ children }: TableHeaderCellProps) {
    return (
        <div className="text-[15px] font-medium text-foreground">
            {children}
        </div>
    );
}

export const columns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "sku",
        header: () => <TableHeaderCell>SKU</TableHeaderCell>
    },
    {
        accessorKey: "name",
        header: () => <TableHeaderCell>Name</TableHeaderCell>
    },
    {
        accessorKey: "categories",
        header: () => <TableHeaderCell>Category</TableHeaderCell>
    },
    {
        accessorKey: "images",
        header: () => <TableHeaderCell>Image</TableHeaderCell>
    },
    {
        accessorKey: "price",
        header: () => <TableHeaderCell>Price</TableHeaderCell>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "THB",
            }).format(price)

            return <div>{formatted}</div>
        },
    },
    {
        accessorKey: "quantity",
        header: () => <TableHeaderCell>Qty</TableHeaderCell>
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const deleteProduct = useDeleteProduct();
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { confirm } = useConfirmDialog();

            const handleDelete = async () => {
                try {
                    const confirmed = await confirm({
                        title: "Delete Product",
                        message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
                        confirmText: 'Delete',
                        cancelText: 'Cancel',
                    });

                    if (confirmed) {
                        deleteProduct.mutate(product.id);
                    }
                } catch (error) {
                    console.error('Error in handleDelete:', error);
                    toast.error('An error occurred while trying to delete the product');
                }
            }

            const handleCopyId = async () => {
                try {
                    await navigator.clipboard.writeText(product.id);
                    toast.success("Product ID copied to clipboard");
                } catch (error) {
                    console.error("Failed to copy:", error);
                    toast.error("Failed to copy product ID");
                }
            }

            const handleView = () => {
                window.location.href = `/admin/products/${product.id}`;
            };

            const handleEdit = () => {
                window.location.href = `/admin/products/${product.id}/edit`;
            };

            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={handleCopyId}>
                                Copy product ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleView}>
                                <Eye className="mr-2 h-4 w-4" />
                                View product
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit product
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleDelete}
                                disabled={deleteProduct.isPending}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deleteProduct.isPending ? 'Deleting...' : 'Delete product'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
]