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
        id: "product",
        header: () => <TableHeaderCell>Product</TableHeaderCell>,
        cell: ({ row }) => {
            const product = row.original;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [imageError, setImageError] = useState(false);

            return (
                <div className="flex items-center gap-3">
                    {/* Product Image */}
                    <div className="w-10 h-10 relative bg-gray-100 rounded-md flex items-center justify-center">
                        {(!product.mainImage || imageError) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                 viewBox="0 0 24 24" fill="none" stroke="#99a1af"
                                 strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                                 className="lucide lucide-image">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                <circle cx="9" cy="9" r="2"/>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                        ) : (
                            <Image
                                src={product.mainImage}
                                alt={product.title}
                                fill
                                className="object-cover rounded-md"
                                sizes="40px"
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>

                    {/* Product Name */}
                    <span className="font-medium text-gray-800">{product.title}</span>
                </div>
            );
        },
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