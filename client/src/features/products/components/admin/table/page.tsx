"use client";

import {DataTable} from "@/features/products/components/admin/table/data-table";
import {columns} from "@/features/products/components/admin/table/columns";
import {useProducts} from "@/features/products/hooks/useProducts";

export function ProductTable() {
    const {
        data,
        isLoading,
        error,
    } = useProducts();

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>{JSON.stringify(error)}</div>;

    return (
        <DataTable columns={columns} data={data ?? []} />
    )
}