"use client"

import {Pagination, ProductList} from "@/features/products/types/product.types";
import {DataTable} from "@/components/common/DataTable";
import {columns} from "@/features/products/components/admin/table/Columns";
import { useBulkDeleteProducts } from "@/features/products/hooks/useProducts";
import { useMemo } from "react";

interface ProductDataTableProps {
    products: ProductList[];
    pagination?: Pagination;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    showingAll?: boolean;
}

export function ProductDataTable({
    products,
    pagination,
    onPageChange,
    onLimitChange,
    showingAll = false,
}: ProductDataTableProps) {
    const bulkDeleteProducts = useBulkDeleteProducts();

    const handleBulkDelete = async (ids: string[]) => {
        return bulkDeleteProducts.mutateAsync(ids);
    }

    const enhancedColumns = useMemo(() => {
        return columns.map((column) => ({
            ...column,
            meta: {
                onBulkDelete: handleBulkDelete,
                isBulkDeleting: bulkDeleteProducts.isPending
            }
        }))
    }, [bulkDeleteProducts.isPending]);

    return (
        <DataTable
            columns={enhancedColumns}
            data={products}
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            showingAll={showingAll}
        />
    )
}