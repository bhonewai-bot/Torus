"use client"

import {useEffect, useState} from "react";
import {ProductFilters} from "@/features/products/types/product.types";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Search, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useDebounce} from "use-debounce";

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
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    useEffect(() => {
        const newSearchValue = debouncedSearch || undefined;
        if (newSearchValue !== filters.search) {
            onFilterChange({ search: newSearchValue });
        }
    }, [debouncedSearch]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    }

    const clearSearch = () => {
        setSearchTerm("");
    }

    const handleCategoryChange = (categoryId: string) => {
        onFilterChange({
            categoryId: categoryId === "all" ? undefined : categoryId,
            page: 1
        });
    }

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
                            key={"product-search"}
                            placeholder={"Search products"}
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
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
                        value={filters.categoryId || "all"}
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