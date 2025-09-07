import {Pagination, Product} from "@/features/products/types/product.types";
import {DataTable} from "@/components/common/DataTable";
import {columns} from "@/features/products/components/admin/table/Columns";

interface ProductDataTableProps {
    products: Product[];
    pagination?: Pagination;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    showingAll?: boolean
}

export function ProductDataTable({
    products,
    pagination,
    onPageChange,
    onLimitChange,
    showingAll = false,
}: ProductDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={products}
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            showingAll={showingAll}
        />
    )
}