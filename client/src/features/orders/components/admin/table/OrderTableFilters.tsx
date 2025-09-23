import { createTableFilter, FilterField } from "@/components/common/TableFilterFactory";
import { ORDER_STATUSES, OrderFilters } from "@/features/orders/types/order.types";

interface OrderTableFiltersProps {
    filters: OrderFilters;
    onFilterChange: (filters: Partial<OrderFilters>) => void;
}

const OrderTableFilter = createTableFilter<OrderFilters>();

export function OrderTableFilters({
    filters,
    onFilterChange,
}: OrderTableFiltersProps) {
    const filterFields: FilterField[] = [
        {
            key: "orderStatus",
            placeholder: "Order Status",
            width: "w-48",
            allOption: {
                value: "all",
                label: "All Status"
            },
            options: ORDER_STATUSES.map(status => ({
                value: status,
                label: status.charAt(0) + status.slice(1).toLowerCase()
            }))
        }
    ];

    return (
        <OrderTableFilter
            filters={filters}
            onFilterChange={onFilterChange}
            config={{
                searchPlaceholder: "Search orders...",
                filterFields
            }}
        />
    );
}