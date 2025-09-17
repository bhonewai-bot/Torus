"use client"

import {useCallback, useEffect, useState} from "react";
import {ProductFilters} from "@/features/products/types/product.types";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Search, X} from "lucide-react";
import {Input} from "@/components/ui/input";

interface Category {
    id: string;
    title: string;
}

interface ProductTableFiltersProps {
    filters: ProductFilters,
    categories: Category[],
    onFilterChange: (filters: Partial<ProductFilters>) => void;
    onCreateProduct: () => void;
}

export function ProductTableFilters({
    filters,
    categories,
    onFilterChange,
    onCreateProduct,
}: ProductTableFiltersProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    // Sync search term with external filters
    useEffect(() => {
        setSearchTerm(filters.search || "");
    }, [filters.search]);

    const handleSearchChange = useCallback((value: string) => {
        const trimmedValue = value.trim();
        setSearchTerm(value); // Keep the raw value for UI
        
        // Only send non-empty search terms, send undefined for empty
        onFilterChange({ 
            search: trimmedValue === "" ? undefined : trimmedValue 
        });
    }, [onFilterChange]);

    const clearSearch = useCallback(() => {
        setSearchTerm("");
        onFilterChange({ search: undefined });
    }, [onFilterChange]);

    const handleCategoryChange = useCallback((categoryId: string) => {
        onFilterChange({
            categoryId: categoryId === "all" ? undefined : categoryId,
        });
    }, [onFilterChange]);

    // Ensure we have a proper value for the category select
    const categorySelectValue = filters.categoryId || "all";

    return (
        <div className={"space-y-4"}>
            <div className={"flex justify-between sm:flex-row gap-4 items-start sm:items-center"}>
                <div className={"flex gap-4"}>
                    <Button onClick={onCreateProduct}>
                        Add Product
                    </Button>

                    {/* Search Input */}
                    <div className={"relative flex-1 max-w-sm"}>
                        <Search className={"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                        <Input
                            placeholder={"Search products..."}
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                            className={"pl-9 lg:w-100 bg-secondary border-transparent h-9.5 font-light placeholder:text-[15px] dark:bg-secondary"}
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className={"absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"}
                            >
                                <X className={"h-4 w-4"} />
                            </button>
                        )}
                    </div>
                </div>

                <div className={"flex gap-2"}>
                    {/* Category Filter */}
                    <Select
                        onValueChange={handleCategoryChange}
                        value={categorySelectValue}
                    >
                        <SelectTrigger className={"w-48 bg-secondary border-transparent h-9.5 font-light text-[15px] dark:bg-secondary focus:border-none"}>
                            <SelectValue placeholder={"Category"} />
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
            </div>
        </div>
    )
}