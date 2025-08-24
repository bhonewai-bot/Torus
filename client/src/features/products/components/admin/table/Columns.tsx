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
import {ReactNode, useState} from "react";
import {Product} from "@/features/products/types/product.types";
import {useDeleteProduct} from "@/features/products/hooks/useProducts";
import {useConfirmDialog} from "@/hooks/useConfirmDialog";
import {toast} from "sonner";
import Image from "next/image";

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
        id: "mainImage",
        cell: ({ row }) => {
            const product = row.original;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [imageError, setImageError] = useState(false);

            if (!product.mainImage || imageError) {
                return (
                    <div className={"w-10 h-10 relative bg-gray-50 rounded-md flex items-center justify-center"}>
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                            />
                        </svg>
                    </div>
                );
            }

            return (
                <div className={"w-10 h-10 relative bg-gray-100 rounded-md flex items-center justify-center"}>
                    <Image
                        src={product.mainImage}
                        alt={product.title}
                        fill
                        className={"object-cover rounded-md"}
                        sizes={"48px"}
                        onError={() => setImageError(true)}
                    />
                </div>
            );
        }

    },
    {
        accessorKey: "sku",
        header: () => <TableHeaderCell>SKU</TableHeaderCell>
    },
    {
        accessorKey: "title",
        header: () => <TableHeaderCell>Name</TableHeaderCell>
    },
    {
        accessorKey: "brand",
        header: () => <TableHeaderCell>Brand</TableHeaderCell>,
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div>{product?.brand || "-"}</div>
            )
        }
    },
    {
        accessorKey: "category",
        header: () => <TableHeaderCell>Category</TableHeaderCell>,
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div>{product?.category?.title || "-"}</div>
            )
        }
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
        header: () => <TableHeaderCell>Inventory</TableHeaderCell>,
        cell: ({ row }) => {
            const quantity = row.getValue("quantity") as number;
            return (
                /*<div className={`${quantity === 0 ? 'text-red-500 font-medium' : ''}`}>
                    {quantity}
                    {quantity === 0 && <span className="ml-1 text-xs">(Out of stock)</span>}
                </div>*/
                <div>
                    {quantity === 0 ? "out of stock" : quantity}
                </div>
            );
        }
    },
    {
        accessorKey: "isActive",
        header: () => <TableHeaderCell>Status</TableHeaderCell>,
        cell: ({ row }) => {
            const isActive = row.getValue("isActive") as boolean;
            return (
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-foreground text-xs font-medium ${
                    isActive
                        ? 'bg-green-100 text-green-800 border-1 dark:bg-green-900/30 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                    {isActive ? 'Active' : 'Inactive'}
                </div>
            );
        },
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
                        message: `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
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