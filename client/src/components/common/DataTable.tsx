"use client";

import {ColumnDef} from "@tanstack/table-core";
import {Pagination} from "@/features/products/types/product.types";
import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useState} from "react";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";
import {Button} from "@/components/ui/button";

// Helper function to generate pagination range
function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
    const delta = 2; // Number of pages to show on each side of current page
    const range: (number | string)[] = [];
    
    if (totalPages <= 1) return [1];
    
    // Calculate start and end of the range around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    
    range.push(1);
    
    // Add ellipsis if there's a gap between 1 and start
    if (start > 2) range.push('...');
    
    // Add pages in the range
    for (let i = start; i <= end; i++) range.push(i);
    
    // Add ellipsis if there's a gap between end and last page
    if (end < totalPages - 1) range.push('...');
    
    // Always show last page (if it's not the first page)
    if (totalPages > 1) range.push(totalPages);
    
    return range;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: Pagination;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    showingAll?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    onPageChange,
    onLimitChange,
    isLoading = false,
    emptyMessage = "No results found.",
    showingAll = false,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
            pagination: {
                pageIndex: (pagination?.page ?? 1) -1,
                pageSize: pagination?.limit ?? 10
            }
        },
        manualPagination: true,
        pageCount: pagination?.totalPages ?? 0,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className={"flex flex-col"}>
            <Table>
                <TableHeader className="border-separate border-spacing-0">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-b-0">
                            {headerGroup.headers.map((header, index) => {
                                const isFirst = index === 0;
                                const isLast = index === headerGroup.headers.length - 1;

                                return (
                                    <TableHead
                                        key={header.id}
                                        className={`
                                        p-3 bg-secondary/40 border-b-0
                                        ${isFirst ? "rounded-tl-md" : ""} 
                                        ${isLast ? "rounded-tr-md" : ""}
                                        `}
                                    >
                                        {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                            )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="border-t-0">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, rowIndex) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className={`hover:bg-secondary/30 ${rowIndex === 0 ? 'border-t-0' : ''}`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="text-[15px] font-light text-secondary-foreground p-3"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border-t-0">
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 rounded-b-md">
                    <div className="flex items-center space-x-2">
                        <div className="text-xs text-muted-foreground">
                            <span className="font-semibold">
                                {showingAll 
                                    ? pagination.total 
                                    : ((pagination.page - 1) * pagination.limit) + 1}
                            </span>
                            {!showingAll && (
                                <>
                                    {" "}to{" "}
                                    <span className="font-semibold">
                                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                                    </span>
                                </>
                            )}
                            {" "}items of{" "}
                            <span className="font-semibold">{pagination.total}</span>
                        </div>

                        {/* Show All / Show Less Button */}
                        {showingAll ? (
                            <button
                                onClick={() => onLimitChange(10)}
                                className="font-medium hover:underline text-[13px] text-primary"
                            >
                                Show Less
                            </button>
                        ) : (
                            pagination.total > pagination.limit && (
                                <button
                                    onClick={() => onLimitChange(-1)}
                                    className="font-medium hover:underline text-[13px] text-primary"
                                >
                                    Show All
                                </button>
                            )
                        )}
                    </div>

                    {/* Only show pagination buttons when NOT showing all */}
                    {!showingAll && (
                        <div className="flex items-center space-x-1">
                            {/* Your existing pagination buttons */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPageChange(1)}
                                disabled={pagination.page === 1 || pagination.totalPages <= 1}
                                title="First page"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={!pagination.hasPreviousPage || pagination.totalPages <= 1}
                                title="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            {/* Page numbers */}
                            {getPaginationRange(pagination.page, pagination.totalPages).map((pageNum, index) => (
                                pageNum === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                                ) : (
                                    <Button
                                        key={pageNum}
                                        variant={pagination.page === pageNum ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => onPageChange(pageNum as number)}
                                        className="min-w-8"
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            ))}
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={!pagination.hasNextPage || pagination.totalPages <= 1}
                                title="Next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPageChange(pagination.totalPages)}
                                disabled={pagination.page === pagination.totalPages || pagination.totalPages <= 1}
                                title="Last page"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}