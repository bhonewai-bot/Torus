"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useState} from "react";
import {Pagination} from "@/features/products/types/product.types";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination?: Pagination
    onPageChange?: (page: number) => void
    onLimitChange?: (limit: number) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    onPageChange,
    onLimitChange,

}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
        manualPagination: true,
        pageCount: pagination?.totalPages ?? 0
    });

    const handlePageChange = (page: number) => {
        if (onPageChange && pagination) {
            const newPage = Math.max(1, Math.min(page, pagination.totalPages));
            onPageChange(newPage);
        }
    }

    const handleLimitChange = (newLimit: string) => {
        if (onLimitChange) {
            onLimitChange(parseInt(newLimit));
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div> {/*// className={"overflow-hidden rounded-md border"}*/}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={"text-muted-foreground text-[15px]"}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className={"flex items-center justify-between px-2 py-4"}>
                    <div className={"flex items-center space-x-2"}>
                        <p className={"text-sm text-muted-foreground"}>
                            Showing{" "}
                            <span className={"font-medium"}>
                                {((pagination.page - 1) * pagination.limit) + 1}
                            </span>{" "}
                            to{" "}
                            <span className={"font-medium"}>
                                {Math.min(pagination.page * pagination.limit, pagination.total)}
                            </span>{" "}
                            of {" "}
                            <span className={"font-medium"}>{pagination.total}</span> results
                        </p>
                        <div className={"flex items-center space-x-2"}>
                            <p className={"text-sm text-muted-foreground"}>Rows per page</p>
                            <Select
                                value={pagination.limit.toString()}
                                onValueChange={handleLimitChange}
                            >
                                <SelectTrigger className={"h-8 w-[70px]"}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent side={"top"}>
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={pageSize.toString()}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className={"flex items-center space-x-2"}>
                        <div className="text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(1)}
                                disabled={!pagination.hasPreviousPage}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPreviousPage}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNextPage}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.totalPages)}
                                disabled={!pagination.hasNextPage}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}