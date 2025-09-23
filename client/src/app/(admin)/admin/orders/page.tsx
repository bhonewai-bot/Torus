"use client";

import { useOrders } from "@/features/orders/hooks/useOrders";
import { OrderFilters } from "@/features/orders/types/order.types";
import { OrderDataTable } from "@/features/orders/components/admin/table/OrderDataTable";
import { OrderTableFilters } from "@/features/orders/components/admin/table/OrderTableFilters";
import { useAdminDataTable } from "@/hooks/useAdminDataTable";
import { AdminTableLayout } from "@/components/layout/AdminTableLayout";

interface ClientFilters {
    search?: string;
    orderStatus?: string;
}

export default function OrdersPage() {
    const initialServerFilters: OrderFilters = {
        page: 1,
        limit: -1,
        sortBy: "createdAt",
        sortOrder: "desc",
    };

    const initialClientFilters: ClientFilters = {};

    const { data, isLoading, error, refetch } = useOrders(initialServerFilters);

    const {
        paginatedData: paginatedOrders,
        paginationInfo,
        allFilters,
        handleFilterChange,
        handlePageChange,
        handleLimitChange,
        showingAll
    } = useAdminDataTable({
        data: data?.orders,
        isLoading,
        error,
        refetch,
        initialServerFilters,
        initialClientFilters,
        clientFilterKeys: ['search', 'orderStatus'],
        searchFields: ['orderNumber'],
        filterFunctions: {
            search: (order, searchTerm) => {
                const searchLower = searchTerm.toLowerCase().trim();
                return order.orderNumber.toLowerCase().includes(searchLower) ||
                    order.user.name.toLowerCase().includes(searchLower);
            },
            orderStatus: (order, status) => order.orderStatus === status
        }
    });

    return (
        <AdminTableLayout
            title="Orders"
            breadcrumbItem="Orders"
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
        >
            <OrderTableFilters
                filters={allFilters}
                onFilterChange={handleFilterChange}
            />

            <OrderDataTable
                orders={paginatedOrders}
                pagination={paginationInfo}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                showingAll={showingAll}
            />
        </AdminTableLayout>
    );
}