"use client";

import {CustomBreadcrumb} from "@/components/common/CustomBreadcrumb";
import {ProductDataTable} from "@/features/products/components/admin/table/ProductDataTable";
import {Button} from "@/components/ui/button";
import {useProducts} from "@/features/products/hooks/useProducts";
import {useMemo, useState} from "react";
import {ProductFilters} from "@/features/products/types/product.types";
import {useCategories} from "@/features/categories/hooks/useCategories";
import {ProductTableFilters} from "@/features/products/components/admin/table/ProductTableFilters";
import {useRouter} from "next/navigation";

export default function ProductsPage() {
    const router = useRouter();

    const [serverFilters, setServerFilters] = useState<ProductFilters>({
        page: 1,
        limit: -1,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const [clientFilters, setClientFilters] = useState<{
        search?: string;
        categoryId?: string;
    }>({});

    // Client-side pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showingAll, setShowingAll] = useState(false);

    const {data, isLoading, error} = useProducts(serverFilters);
    const {data: categories = []} = useCategories();

    // First filter, then paginate
    const filteredProducts = useMemo(() => {
        let filtered = data?.products || [];

        // Search filter - ensure we handle both empty strings and undefined
        if (clientFilters.search && clientFilters.search.trim() !== "") {
            const searchLower = clientFilters.search.toLowerCase().trim();
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(searchLower) ||
                product.sku?.toLowerCase().includes(searchLower)
            );
        }

        // Category filter - ensure we properly check for valid categoryId
        if (clientFilters.categoryId && clientFilters.categoryId !== "all") {
            filtered = filtered.filter(product => 
                product.category?.id === clientFilters.categoryId
            );
        }

        return filtered;
    }, [data?.products, clientFilters]);

    // Client-side pagination
    const paginatedProducts = useMemo(() => {
        if (showingAll) {
            return filteredProducts;
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, currentPage, itemsPerPage, showingAll]);

    // Create pagination info for filtered results
    const paginationInfo = useMemo(() => {
        const total = filteredProducts.length;
        const totalPages = Math.ceil(total / itemsPerPage);
        
        return {
            total,
            page: currentPage,
            limit: itemsPerPage,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
        };
    }, [filteredProducts.length, currentPage, itemsPerPage]);

    // Filter handler - improved to handle clearing filters properly
    const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
        if ('search' in newFilters || 'categoryId' in newFilters) {
            setClientFilters(prev => {
                const updated = { ...prev };
                
                // Handle search filter
                if ('search' in newFilters) {
                    if (newFilters.search === undefined || newFilters.search === "") {
                        delete updated.search; // Remove the property entirely
                    } else {
                        updated.search = newFilters.search;
                    }
                }
                
                // Handle category filter
                if ('categoryId' in newFilters) {
                    if (newFilters.categoryId === undefined || newFilters.categoryId === "all") {
                        delete updated.categoryId; // Remove the property entirely
                    } else {
                        updated.categoryId = newFilters.categoryId;
                    }
                }
                
                return updated;
            });
            
            // Reset to first page when filtering
            setCurrentPage(1);
        } else {
            // Other filters trigger server requests
            setServerFilters(prev => ({ ...prev, ...newFilters }));
        }
    }

    const handleCreateProduct = () => {
        router.push("/admin/products/create");
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
            <main className={"flex flex-col gap-6"}>
                <div className={"flex flex-col gap-4"}>
                    <CustomBreadcrumb item={"Products"} />
                    <div className={"flex justify-between"}>
                        <h1 className={"text-3xl font-medium"}>Products</h1>
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
                    <CustomBreadcrumb item={"Product"} />
                    <div className={"flex justify-between"}>
                        <h1 className={"text-3xl font-medium"}>Products</h1>
                    </div>
                </div>
                <div className={"flex items-center justify-center h-64"}>
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading products</p>
                        <Button variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className={"flex flex-col gap-6 mb-6"}>
            {/* Header */}
            <div className={"flex flex-col gap-4"}>
                <CustomBreadcrumb item={"Products"} />
                <div className={"flex justify-between"}>
                    <h1 className={"text-3xl font-medium"}>Products</h1>
                </div>
            </div>

            {/* Filters */}
            <ProductTableFilters
                filters={{...serverFilters, ...clientFilters}}
                categories={categories}
                onFilterChange={handleFilterChange}
                onCreateProduct={handleCreateProduct}
            />

            <ProductDataTable
                products={paginatedProducts}
                pagination={paginationInfo}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                showingAll={showingAll}
            />
        </main>
    );
}