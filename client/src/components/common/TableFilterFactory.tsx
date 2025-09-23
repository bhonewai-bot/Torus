import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface BaseFilters {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterField {
    key: string;
    placeholder: string;
    options: FilterOption[];
    width?: string;
    defaultValue?: string;
    allOption?: {
        value: string;
        label: string;
    };
}

export interface TableFilterConfig<TFilters extends BaseFilters> {
    searchPlaceholder: string;
    searchWidth?: string;
    createButtonText?: string;
    onCreateClick?: () => void;
    filterFields?: FilterField[];
}

export interface TableFilterProps<TFilters extends BaseFilters> {
    filters: TFilters;
    onFilterChange: (filters: Partial<TFilters>) => void;
    config: TableFilterConfig<TFilters>;
}

export function createTableFilter<TFilters extends BaseFilters>() {
    return function TableFilter({
        filters,
        onFilterChange,
        config,
    }: TableFilterProps<TFilters>) {
        const [searchTerm, setSearchTerm] = useState(filters.search || "");

        useEffect(() => {
            setSearchTerm(filters.search || "");
        }, [filters.search]);

        const handleSearchChange = useCallback((value: string) => {
            const trimmedValue = value.trim();
            setSearchTerm(value); // Keep the raw value for UI
            
            // Only send non-empty search terms, send undefined for empty
            onFilterChange({ 
                search: trimmedValue === "" ? undefined : trimmedValue 
            } as Partial<TFilters>);
        }, [onFilterChange]);

        const clearSearch = useCallback(() => {
            setSearchTerm("");
            onFilterChange({ search: undefined } as Partial<TFilters>);
        }, [onFilterChange]);

        const handleFilterChange = useCallback((fieldKey: string, value: string, allValue: string = "all") => {
            onFilterChange({
                [fieldKey]: value === allValue ? undefined : value,
            } as Partial<TFilters>);
        }, [onFilterChange]);

        return (
            <div className="space-y-4">
                <div className="flex justify-between sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex gap-4">
                        {config.onCreateClick && config.createButtonText && (
                            <Button onClick={config.onCreateClick}>
                                {config.createButtonText}
                            </Button>
                        )}

                        {/* Search Input */}
                        <div className={`relative flex-1 ${config.searchWidth || 'max-w-sm'}`}>
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={config.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                className="pl-9 lg:w-100 bg-secondary border-transparent h-9.5 font-light placeholder:text-[15px] dark:bg-secondary"
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

                    {config.filterFields && config.filterFields.length > 0 && (
                        <div className="flex gap-2">
                            {config.filterFields.map((field) => {
                                const currentValue = (filters as any)[field.key] || field.allOption?.value || "all";
                                
                                return (
                                    <Select
                                        key={field.key}
                                        onValueChange={(value) => handleFilterChange(field.key, value, field.allOption?.value)}
                                        value={currentValue}
                                    >
                                        <SelectTrigger className={`${field.width || 'w-48'} bg-secondary border-transparent h-9.5 font-light text-[15px] dark:bg-secondary focus:border-none`}>
                                            <SelectValue placeholder={field.placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.allOption && (
                                                <SelectItem value={field.allOption.value}>
                                                    {field.allOption.label}
                                                </SelectItem>
                                            )}
                                            {field.options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    };
}