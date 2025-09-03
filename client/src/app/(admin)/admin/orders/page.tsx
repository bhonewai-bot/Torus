"use client";

import {CustomBreadcrumb} from "@/components/common/CustomBreadcrumb";
import {Button} from "@/components/ui/button";
import {useOrders} from "@/features/orders/hooks/useOrders";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {OrderFilters} from "@/features/orders/types/order.types";
import {OrderDataTable} from "@/features/orders/components/admin/table/OrderDataTable";

export default function OrderPage() {
    const router = useRouter();

    const [filters, setFilters] = useState<OrderFilters>({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const { data, isLoading, error, refetch } = useOrders(filters);
    console.log(data);

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    }

    const handleLimitChange = (limit: number) => {
        setFilters(prev => ({ ...prev, limit, page: 1 }));
    }

    if (isLoading) {
        return (
            <div className={"flex flex-col gap-6"}>
                <div className={"flex flex-col gap-4"}>
                    <CustomBreadcrumb item={"Order"} />
                    <div className={"flex justify-between"}>
                        <h1 className={"text-3xl font-medium"}>Orders</h1>
                        <div className={"flex gap-2"}>
                            <Button disabled className="bg-muted-foreground">Export</Button>
                            <Button disabled className="bg-muted-foreground">Import</Button>
                        </div>
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
                    <div className={"flex gap-2"}>
                        <Button className={"bg-muted-foreground"}>Export</Button>
                        <Button className={"bg-muted-foreground"}>Import</Button>
                    </div>
                </div>
            </div>

            <OrderDataTable
                orders={data?.orders || []}
                pagination={data?.pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </div>
    )
}