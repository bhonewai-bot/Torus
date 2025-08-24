"use client";

import {ProductTableFilters} from "@/features/products/components/admin/table/productTableFilters";
import {columns} from "@/features/products/components/admin/table/columns";
import {useProducts} from "@/features/products/hooks/useProducts";
import {useEffect, useState} from "react";
import {Product, ProductFilters} from "@/features/products/types/product.types";
import {Button} from "@/components/ui/button";
import {Search, X} from "lucide-react";
import { Input } from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useDebounce} from "use-debounce";
import {useCategories} from "@/features/categories/hooks/useCategories";

export function ProductDataTable() {
    const { data: categories = [] } = useCategories();

    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
        categoryId: undefined,
        search: undefined,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [debounceSearch] = useDebounce(searchTerm, 500);

    const {
        data,
        isLoading,
        error,
    } = useProducts(filters);

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (!data) return;

        let temp = data.products;

        // Filter by category
        if (filters.categoryId) {
            temp = temp.filter(p => p.category?.id === filters.categoryId);
        }

        // Filter by search input
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            temp = temp.filter(
                p =>
                    p.title.toLowerCase().includes(lower) ||
                    p.sku.toLowerCase().includes(lower) ||
                    p.brand?.toLowerCase().includes(lower)
            );
        }

        setFilteredProducts(temp);
    }, [data, searchTerm, filters.categoryId]);


    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setFilters(prev => ({
            ...prev,
            search: undefined,
            page: 1,
        }));
    };

    const onCategoryChange = (categoryId: string) => {
        setFilters(prev => ({
            ...prev,
            categoryId: categoryId === "all" ? undefined : categoryId,
            page: 1,
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({
            ...prev,
            page,
        }));
    };

    const handleLimitChange = (limit: number) => {
        setFilters(prev => ({
            ...prev,
            limit,
            page: 1, // Reset to first page when changing limit
        }));
    };

    if (isLoading) {
        return (
            <div className={"flex items-center justify-center h-64"}>
                <div className={"animate-spin rounded-full h-24 w-24 border-b-2 border-primary"}></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading products</p>
                    <pre className="text-sm text-gray-500 bg-gray-100 p-4 rounded">
                        {JSON.stringify(error, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }

    console.log(data)

    return (
        <div className="space-y-4">
            <div className="flex justify-between sm:flex-row gap-4 items-start sm:items-center">
                <div className={"flex gap-4"}>
                    <Button onClick={() => window.location.href = '/admin/products/create'}>
                        Add Product
                    </Button>
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-9"
                        />

                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <Select onValueChange={onCategoryChange} value={filters.categoryId || "all"}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"all"}>All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Data Table */}
            <ProductTableFilters
                key={"products-table"}
                columns={columns}
                data={filteredProducts}
                pagination={data?.pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </div>
    )
}