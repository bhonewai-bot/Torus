import { DataTable } from "@/components/common/DataTable";
import { columns } from "@/features/users/components/admin/table/Columns";
import { Pagination } from "@/features/products/types/product.types";
import { UserList } from "@/features/users/types/user.types";

interface UserDataTableProps {
    users: UserList[];
    pagination?: Pagination;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export function UserDataTable({
    users,
    pagination,
    onPageChange,
    onLimitChange,
}: UserDataTableProps) {
    return (
        <DataTable 
            columns={columns}
            data={users}
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
        />
    )
}