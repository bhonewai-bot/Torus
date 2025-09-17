import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUSES, OrderFilters, OrderStatus } from "@/features/orders/types/order.types"
import { on } from "events";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface OrderTableFiltersProps {
    filters: OrderFilters;
    onFilterChange: (filters: Partial<OrderFilters>) => void;
}

export function OrderTableFilters({
    filters,
    onFilterChange,
}: OrderTableFiltersProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    useEffect(() => {
        setSearchTerm(filters.search || "");
    }, [filters.search]);

    const handleSearchChange = useCallback((value: string) => {
        const trimmedValue = value.trim();
        setSearchTerm(value);

        onFilterChange({
            search: trimmedValue === "" ? undefined : trimmedValue
        });
    }, [onFilterChange]);

    const clearSearch = useCallback(() => {
        setSearchTerm("");
        onFilterChange({ search: undefined });
    }, [onFilterChange]);

    const handleStatusChange = useCallback((status: string) => {
        onFilterChange({
            orderStatus: status === "all" ? undefined : status as OrderStatus,
        });
    }, [onFilterChange]);

    const statusSelectValue = filters.orderStatus || "all";

    return (
        <div className="space-y-4">
            <div className={"flex justify-between sm:flex-row gap-4 items-start sm:items-center"}>
                <div className={"relative flex-1 max-w-sm"}>
                    <Search className={"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                    <Input
                        placeholder={"Search Orders..."}
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

                <div className={"flex gap-2"}>
                    {/* Category Filter */}
                    <Select
                        onValueChange={handleStatusChange}
                        value={statusSelectValue}
                    >
                        <SelectTrigger className={"w-48 bg-secondary border-transparent h-9.5 font-light text-[15px] dark:bg-secondary focus:border-none"}>
                            <SelectValue placeholder={"Order Status"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"all"}>All Status</SelectItem>
                            {ORDER_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}