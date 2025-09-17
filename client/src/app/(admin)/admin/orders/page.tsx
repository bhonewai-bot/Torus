"use client";

import {CustomBreadcrumb} from "@/components/common/CustomBreadcrumb";
import {Button} from "@/components/ui/button";
import {useOrders} from "@/features/orders/hooks/useOrders";
import {useMemo, useState} from "react";
import {OrderFilters} from "@/features/orders/types/order.types";
import {OrderDataTable} from "@/features/orders/components/admin/table/OrderDataTable";
import { OrderTableFilters } from "@/features/orders/components/admin/table/OrderTableFilters";

export default function OrderPage() {
    const [serverFilters, setServerFilters] = useState<OrderFilters>({
        page: 1,
        limit: -1,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const [clientFilters, setClientFilters] = useState<{
        search?: string;
        orderStatus?: string;
    }>({});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showingAll, setShowingAll] = useState(false);

    const { data, isLoading, error, refetch } = useOrders(serverFilters);

    const filteredOrders = useMemo(() => {
        let filtered = data?.orders || [];

        if (clientFilters.search && clientFilters.search.trim() !== "") {
            const searchLower = clientFilters.search.toLowerCase().trim();
            filtered = filtered.filter(order => 
                order.orderNumber.toLowerCase().includes(searchLower) ||
                order.user.name.toLowerCase().includes(searchLower)
            )
        }

        if (clientFilters.orderStatus && clientFilters.orderStatus !== "all") {
            filtered = filtered.filter(order => 
                order.orderStatus === clientFilters.orderStatus
            );
        }

        return filtered;
    }, [data?.orders, clientFilters]);

    const paginatedOrders = useMemo(() => {
        if (showingAll) {
            return filteredOrders;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, currentPage, itemsPerPage, showingAll]);

    const paginationInfo = useMemo(() => {
        const total = filteredOrders.length;
        const totalPages = Math.ceil(total / itemsPerPage); 

        return {
            total,
            page: currentPage,
            limit: itemsPerPage,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
        }
    }, [filteredOrders.length, currentPage, itemsPerPage]);

    const handleFilterChange = (newFilters: Partial<OrderFilters>) => {
        if ("search" in newFilters || "orderStatus" in newFilters) {
            setClientFilters(prev => {
                const updated = { ...prev };

                if ("search" in newFilters) {
                    if (newFilters.search === undefined || newFilters.search === "") {
                        delete updated.search; // Remove the property entirely
                    } else {
                        updated.search = newFilters.search;
                    }
                }

                if ('orderStatus' in newFilters) {
                    if (newFilters.orderStatus === undefined || newFilters.orderStatus === "all") {
                        delete updated.orderStatus; // Remove the property entirely
                    } else {
                        updated.orderStatus = newFilters.orderStatus;
                    }
                }

                return updated;
            });

            setCurrentPage(1);
        } else {
            setServerFilters(prev => ({ ...prev, ...newFilters }))
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleLimitChange = (limit: number) => {
        if (limit === -1) {
            setShowingAll(true);
        } else {
            setShowingAll(false);
            setItemsPerPage(limit);
            setCurrentPage(1); // Reset to first page
        }
    }

    if (isLoading) {
        return (
            <div className={"flex flex-col gap-6"}>
                <div className={"flex flex-col gap-4"}>
                    <CustomBreadcrumb item={"Order"} />
                    <div className={"flex justify-between"}>
                        <h1 className={"text-3xl font-medium"}>Orders</h1>
                    </div>
                </div>
                <div className={"flex items-center justify-center h-64"}>
                    <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <main className={"flex flex-col gap-6"}>
                <div className={"flex flex-col gap-4"}>
                    <CustomBreadcrumb item={"Order"} />
                    <div className={"flex justify-between"}>
                        <h1 className={"text-3xl font-medium"}>Orders</h1>
                    </div>
                </div>
                <div className={"flex items-center justify-center h-64"}>
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading orders</p>
                        <Button onClick={() => refetch()} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <div className={"flex flex-col gap-6"}>
            <div className={"flex flex-col gap-4"}>
                <CustomBreadcrumb item={"Order"} />
                <div className={"flex justify-between"}>
                    <h1 className={"text-3xl font-medium"}>Orders</h1>
                </div>
            </div>

            <OrderTableFilters
                filters={{ ...serverFilters, ...clientFilters }}
                onFilterChange={handleFilterChange}
            />

            <OrderDataTable
                orders={paginatedOrders}
                pagination={paginationInfo}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                showingAll={showingAll}
            />
        </div>
    )
}