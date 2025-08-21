"use client";

import {DataTable} from "@/features/products/components/admin/table/data-table";
import {columns} from "@/features/products/components/admin/table/columns";
import {useProducts} from "@/features/products/hooks/useProducts";
import {useState} from "react";
import {ProductFilters} from "@/features/products/types/product.types";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import { Input } from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export function ProductTable() {
    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 10,
    });

    const {
        data,
        isLoading,
        error,
    } = useProducts();

    const handleSearchChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            search: value,
            page: 1, // Reset to first page when searching
        }));
    };

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-');
        setFilters(prev => ({
            ...prev,
            sortBy,
            sortOrder: sortOrder as 'asc' | 'desc',
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
            {/* Header */}
            <div className="flex justify-between items-center">
                <Button onClick={() => window.location.href = '/admin/products/create'}>
                    Add Product
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={filters.search || ''}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select onValueChange={handleSortChange} defaultValue="title-asc">
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="title-asc">Name (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Name (Z-A)</SelectItem>
                        <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                        <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                        <SelectItem value="quantity-asc">Stock (Low to High)</SelectItem>
                        <SelectItem value="quantity-desc">Stock (High to Low)</SelectItem>
                        <SelectItem value="createdAt-desc">Newest First</SelectItem>
                        <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={data?.products ?? []}
                pagination={data?.pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </div>
    )
}