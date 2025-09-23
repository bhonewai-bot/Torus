"use client";

import { AdminTableLayout } from "@/components/layout/AdminTableLayout";
import { UserDataTable } from "@/features/users/components/admin/table/UserDataTable";
import { UserTableFilters } from "@/features/users/components/admin/table/UserTableFilters";
import { useUsers } from "@/features/users/hooks/useUsers";
import { UserFilters } from "@/features/users/types/user.types";
import { useAdminDataTable } from "@/hooks/useAdminDataTable";

interface ClientFilters {
    search?: string;
    role?: string;
    status?: string;
}

export default function UsersPage() {
    const initialServerFilters: UserFilters = {
        page: 1,
        limit: -1,
        sortBy: "createdAt",
        sortOrder: "desc",
    };

    const initialClientFilters: ClientFilters = {};

    const { data, isLoading, error, refetch } = useUsers(initialServerFilters);

    const {
        paginatedData: paginatedUsers,
        paginationInfo,
        allFilters,
        handleFilterChange,
        handlePageChange,
        handleLimitChange
    } = useAdminDataTable({
        data: data?.users,
        isLoading,
        error,
        refetch,
        initialServerFilters,
        initialClientFilters,
        clientFilterKeys: ['search', 'role', 'status'],
        searchFields: ['name', 'email'],
        filterFunctions: {
            role: (user, role) => user.role === role,
            status: (user, status) => user.status === status
        }
    });

    return (
        <AdminTableLayout
            title="Users"
            breadcrumbItem="Users"
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
        >
            <UserTableFilters 
                filters={allFilters}
                onFilterChange={handleFilterChange}
            />

            <UserDataTable 
                users={paginatedUsers} 
                pagination={paginationInfo}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </AdminTableLayout>
    );
}