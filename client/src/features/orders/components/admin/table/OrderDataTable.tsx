import {DataTable} from "@/components/common/DataTable";
import {columns} from "@/features/orders/components/admin/table/Columns";
import {OrderList, Pagination} from "@/features/orders/types/order.types";

interface OrderDataTableProps {
    orders: OrderList[];
    pagination?: Pagination;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export function OrderDataTable({
    orders,
    pagination,
    onPageChange,
    onLimitChange,
}: OrderDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={orders}
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
        />
    )
}