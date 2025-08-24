"use client";

import {ProductBreadcrumb} from "@/features/products/components/admin/ProductBreadcrumb";
import {ProductDataTable} from "@/features/products/components/admin/table/ProductDataTable";
import {Button} from "@/components/ui/button";
import {useProducts} from "@/features/products/hooks/useProducts";
import {useState} from "react";
import {ProductFilters} from "@/features/products/types/product.types";
import {useCategories} from "@/features/categories/hooks/useCategories";
import {ProductTableFilters} from "@/features/products/components/admin/table/ProductTableFilters";
import {useRouter} from "next/navigation";

export default function ProductsPage() {
    const router = useRouter();

    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const {
        data,
        isLoading,
        error,
        refetch
    } = useProducts(filters);

    const { data: categories = [] } = useCategories();

    // Filter handler
    const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            // Reset page when filters change (except pagination)
            ...(newFilters.page === undefined && { page: 1 })
        }));
    }

    const handleCreateProduct = () => {
        router.push("/admin/products/create");
    }

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    }

    const handleLimitChange = (limit: number) => {
        setFilters(prev => ({ ...prev, limit, page: 1 }));
    }

    if (isLoading) {
        return (
            <main className={"flex flex-col gap-6"}>
                <div className={"flex flex-col gap-4"}>
                    <ProductBreadcrumb item={"Product"} />
                    <div className={"flex justify-between"}>
                        <h1 className={"text-3xl font-medium"}>Products</h1>
                        <div className={"flex gap-2"}>
                            <Button disabled className="bg-muted-foreground">Export</Button>
                            <Button disabled className="bg-muted-foreground">Import</Button>
                        </div>
                    </div>
                </div>
                <div className={"flex items-center justify-center h-64"}>
                    <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className={"flex flex-col gap-6"}>
                <div className={"flex flex-col gap-4"}>
                    <ProductBreadcrumb item={"Product"} />
                    <div className={"flex justify-between"}>
                        <h1 className={"text-3xl font-medium"}>Products</h1>
                    </div>
                </div>
                <div className={"flex items-center justify-center h-64"}>
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading products</p>
                        <Button onClick={() => refetch()} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className={"flex flex-col gap-6"}>
            {/* Header */}
            <div className={"flex flex-col gap-4"}>
                <ProductBreadcrumb item={"Products"} />
                <div className={"flex justify-between"}>
                    <h1 className={"text-3xl font-medium"}>Products</h1>
                    <div className={"flex gap-2"}>
                        <Button className={"bg-muted-foreground"}>Export</Button>
                        <Button className={"bg-muted-foreground"}>Import</Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <ProductTableFilters
                filters={filters}
                categories={categories}
                onFilterChange={handleFilterChange}
                onCreateProduct={handleCreateProduct}
            />

            <ProductDataTable
                products={data?.products || []}
                pagination={data?.pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </main>
    );
}