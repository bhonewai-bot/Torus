"use client";

import { ProductDataTable } from "@/features/products/components/admin/table/ProductDataTable";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductFilters } from "@/features/products/types/product.types";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ProductTableFilters } from "@/features/products/components/admin/table/ProductTableFilters";
import { useRouter } from "next/navigation";
import { useAdminDataTable } from "@/hooks/useAdminDataTable";
import { AdminTableLayout } from "@/components/layout/AdminTableLayout";

interface ClientFilters {
    search?: string;
    categoryId?: string;
}

export default function ProductsPage() {
    const router = useRouter();
    
    const initialServerFilters: ProductFilters = {
        page: 1,
        limit: -1,
        sortBy: "createdAt",
        sortOrder: "desc",
    };

    const initialClientFilters: ClientFilters = {};

    const { data, isLoading, error } = useProducts(initialServerFilters);
    const { data: categories = [] } = useCategories();

    const {
        paginatedData: paginatedProducts,
        paginationInfo,
        allFilters,
        handleFilterChange,
        handlePageChange,
        handleLimitChange,
        showingAll
    } = useAdminDataTable({
            data: data?.products,
            isLoading,
            error,
            initialServerFilters,
            initialClientFilters,
            clientFilterKeys: ['search', 'categoryId'],
            searchFields: ['title', 'sku'],
            filterFunctions: {
            categoryId: (product, categoryId) => product.category?.id === categoryId
        }
    });

    const handleCreateProduct = () => {
        router.push("/admin/products/create");
    };

    return (
        <AdminTableLayout
            title="Products"
            breadcrumbItem="Products"
            isLoading={isLoading}
            error={error}
        >
            <ProductTableFilters
                filters={allFilters}
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
        </AdminTableLayout>
    );
}