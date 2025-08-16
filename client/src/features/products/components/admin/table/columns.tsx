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
import { MoreHorizontal } from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {ReactNode} from "react";

export type Products = {
    name: string;
    sku: string;
    price: number;
    categories: string[];
    images?: string[];
    quantity: number;
}

type HeaderProps = {
    children: ReactNode;
}

function Header({children}: HeaderProps) {
    return (
        <div className={"font-semibold text-foreground"}>{children}</div>
    )
}

export const columns: ColumnDef<Products>[] = [
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
        header: () => <Header>SKU</Header>
    },
    {
        accessorKey: "name",
        header: () => <Header>Name</Header>
    },
    {
        accessorKey: "categories",
        header: () => <Header>Category</Header>
    },
    {
        accessorKey: "images",
        header: () => <Header>Image</Header>
    },
    {
        accessorKey: "price",
        header: () => <Header>Price</Header>,
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
        header: () => <Header>Qty</Header>
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <div className={"text-right"}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem

                            >
                                Copy payment ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                            <DropdownMenuItem>View payment details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]