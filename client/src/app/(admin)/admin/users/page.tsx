"use client";

import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { UserDataTable } from "@/features/users/components/admin/table/UserDataTable";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useState } from "react";

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useUsers({ page, limit });
    
    // Extract users array and pagination from the response
    const users = data?.users || [];
    const pagination = data?.pagination;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        if (newLimit === -1) {
            // Show all items
            setLimit(pagination?.total || 1000);
            setPage(1);
        } else {
            setLimit(newLimit);
            setPage(1);
        }
    };

    if (isLoading) {
        return (
            <div className={"flex flex-col gap-6 mb-6"}>
                <div className={"flex flex-col gap-4"}>
                    <CustomBreadcrumb item={"Users"} />
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-medium">Users</h1>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={"flex flex-col gap-6 mb-6"}>
            <div className={"flex flex-col gap-4"}>
                <CustomBreadcrumb item={"Users"} />
                <div className="flex justify-between">
                    <h1 className="text-3xl font-medium">Users</h1>
                </div>
            </div>

            <UserDataTable 
                users={users} 
                pagination={pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </div>
    );
}