import { createTableFilter, FilterField } from "@/components/common/TableFilterFactory";
import { ProductFilters } from "@/features/products/types/product.types";

interface Category {
    id: string;
    title: string;
}

interface ProductTableFiltersProps {
    filters: ProductFilters;
    categories: Category[];
    onFilterChange: (filters: Partial<ProductFilters>) => void;
    onCreateProduct: () => void;
}

const ProductTableFilter = createTableFilter<ProductFilters>();

export function ProductTableFilters({
    filters,
    categories,
    onFilterChange,
    onCreateProduct,
}: ProductTableFiltersProps) {
    const filterFields: FilterField[] = [
        {
            key: "categoryId",
            placeholder: "Category",
            width: "w-48",
            allOption: {
                value: "all",
                label: "All Categories"
            },
            options: categories.map(category => ({
                value: category.id,
                label: category.title
            }))
        }
    ];

    return (
        <ProductTableFilter
            filters={filters}
            onFilterChange={onFilterChange}
            config={{
                searchPlaceholder: "Search products...",
                createButtonText: "Add Product",
                onCreateClick: onCreateProduct,
                filterFields
            }}
        />
    );
}