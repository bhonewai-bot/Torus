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
import {Edit, MoreHorizontal, Trash2} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {ReactNode, useState} from "react";
import {ProductList} from "@/features/products/types/product.types";
import {useDeleteProduct} from "@/features/products/hooks/useProducts";
import {useConfirmDialog} from "@/hooks/useConfirmDialog";
import {toast} from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type TableHeaderCellProps = {
    children: ReactNode;
};

export function TableHeaderCell({ children }: TableHeaderCellProps) {
    return (
        <div className="text-[15px] font-normal">
            {children}
        </div>
    );
}

function ProductCell({ product }: { product: any }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Product Image */}
      <div className="w-10 h-10 relative bg-gray-100 rounded-md flex items-center justify-center">
        {!product.mainImage || imageError ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#99a1af"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-image"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
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
      <Link
        href={`/admin/products/${product.id}/edit`}
        className="max-w-[300px] truncate font-normal text-primary dark:text-primary hover:underline"
      >
        {product.title}
      </Link>
    </div>
  );
}

export const columns: ColumnDef<ProductList>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all products"
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
        cell: ({ row }: { row: any }) => <ProductCell product={row.original} />,
        size: 200
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
                <div>
                    {quantity === 0 ? "out of stock" : quantity}
                </div>
            );
        }
    },
    {
        accessorKey: "status",
        header: () => <TableHeaderCell>Status</TableHeaderCell>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            
            const getStatusStyles = (status: string) => {
                switch (status) {
                    case "ACTIVE":
                        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
                    case "INACTIVE":
                        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200";
                    case "DISCONTINUED":
                        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
                    default:
                        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
                }
            };
            
            const getStatusLabel = (status: string) => {
                switch (status) {
                    case "ACTIVE":
                        return "Active";
                    case "INACTIVE":
                        return "Inactive";
                    case "DISCONTINUED":
                        return "Discontinued";
                    default:
                        return status;
                }
            };
            
            return (
                <Badge className={`border-none px-[9px] py-[5px] rounded-md font-semibold ${getStatusStyles(status)}`}>
                    {getStatusLabel(status)}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const product = row.original;
            const deleteProduct = useDeleteProduct();
            const { confirm } = useConfirmDialog();

            const selectedRows = table.getFilteredSelectedRowModel().rows;
            const selectedCount = selectedRows.length;
            const isCurrentRowSelected = row.getIsSelected();
            const hasSection = selectedCount > 0;

            const handleDelete = async () => {
                try {
                    const confirmed = await confirm({
                        title: "Delete Product",
                        message: `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
                        confirmText: "Delete",
                        cancelText: "Cancel"
                    });

                    if (confirmed) {
                        try {
                            await deleteProduct.mutateAsync(product.id);
                            toast.success(`Product "${product.title}" deleted successfully.`);
                        } catch (error) {
                            // The hook's onError will handle the global error display
                        }
                    }
                } catch (error) {
                    console.error("Error in handleDelete:", error);
                }
            }

            const handleBulkDelete = async () => {
                try {
                    const selectedIds = selectedRows.map((row) => (row.original as any).id);
                    const confirmed = await confirm({
                        title: `Delete ${selectedCount} Products`,
                        message: `Are you sure you want to delete ${selectedCount} selected products? This action cannot be undone.`,
                        confirmText: "Delete All",
                        cancelText: "Cancel"
                    });

                    if (confirmed) {
                        if (table.options.meta?.onBulkDelete) {
                            await table.options.meta.onBulkDelete(selectedIds);
                            table.resetRowSelection();
                        }
                    }
                } catch (error) {
                    toast.error('An error occurred while trying to delete the products');
                }
            }

            const handleCopyId = async () => {
                try {
                    await navigator.clipboard.writeText(product.id);
                    toast.success("Product ID copied to clipboard");
                } catch (error) {
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
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-secondary">
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
                            {/* <DropdownMenuItem onClick={handleView}>
                                <Eye className="mr-2 h-4 w-4" />
                                View product
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit product
                            </DropdownMenuItem>

                            {hasSection && (
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={handleBulkDelete}
                                    disabled={table.options.meta?.isBulkDeleting}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {table.options.meta?.isBulkDeleting ? 'Deleting...' : `Delete ${selectedCount} products`}
                                </DropdownMenuItem>
                            )}
                            {!hasSection && (
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deleteProduct.isPending}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {deleteProduct.isPending ? 'Deleting...' : 'Delete product'}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
]