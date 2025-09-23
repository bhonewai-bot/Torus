import { useMemo, useState } from "react";

export interface BaseFilters {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface AdminDataTableConfig<TData, TServerFilters extends BaseFilters, TClientFilters> {
    data: TData[] | undefined;
    isLoading: boolean;
    error?: Error | null;
    refetch?: () => void;
    initialServerFilters: TServerFilters;
    initialClientFilters: TClientFilters;
    clientFilterKeys: (keyof TClientFilters)[];
    searchFields: (keyof TData)[];
    filterFunctions?: {
        [K in keyof TClientFilters]?: (item: TData, value: TClientFilters[K]) => boolean;
    };
}

export function useAdminDataTable<TData, TServerFilters extends BaseFilters, TClientFilters>({
    data,
    isLoading,
    error,
    refetch,
    initialServerFilters,
    initialClientFilters,
    clientFilterKeys,
    searchFields,
    filterFunctions = {}
}: AdminDataTableConfig<TData, TServerFilters, TClientFilters>) {
  
    const [serverFilters, setServerFilters] = useState<TServerFilters>(initialServerFilters);
    const [clientFilters, setClientFilters] = useState<TClientFilters>(initialClientFilters);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showingAll, setShowingAll] = useState(false);

    const filteredData = useMemo(() => {
        let filtered = data || [];

        // Apply search filter
        if ('search' in clientFilters && clientFilters.search && 
            typeof clientFilters.search === 'string' && clientFilters.search.trim() !== ""
        ) {
            const searchLower = clientFilters.search.toLowerCase().trim();
            filtered = filtered.filter(item =>
                searchFields.some(field => {
                    const value = item[field];
                    return typeof value === 'string' && value.toLowerCase().includes(searchLower);
                })
            );  
        }

        Object.keys(clientFilters).forEach(key => {
            if (key !== 'search' && clientFilters[key as keyof TClientFilters] !== undefined) {
                const value = clientFilters[key as keyof TClientFilters];
                
                if (value === "all") return;
                
                if (filterFunctions[key as keyof TClientFilters]) {
                    filtered = filtered.filter(item => 
                        filterFunctions[key as keyof TClientFilters]!(item, value)
                    );
                } else {
                    filtered = filtered.filter(item => item[key as keyof TData] === value);
                }
            }
        });

        return filtered;
    }, [data, clientFilters, searchFields, filterFunctions]);

    const paginatedData = useMemo(() => {
        if (showingAll) {
            return filteredData;
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, itemsPerPage, showingAll]);

    const paginationInfo: PaginationInfo = useMemo(() => {
        const total = filteredData.length;
        const totalPages = Math.ceil(total / itemsPerPage);
        
        return {
            total,
            page: currentPage,
            limit: itemsPerPage,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
        };
    }, [filteredData.length, currentPage, itemsPerPage]);

    const handleFilterChange = (newFilters: Partial<TServerFilters & TClientFilters>) => {
        const hasClientFilters = clientFilterKeys.some(key => key in newFilters);
        
        if (hasClientFilters) {
            setClientFilters(prev => {
                const updated = { ...prev };
                
                clientFilterKeys.forEach(key => {
                    if (key in newFilters) {
                        const value = newFilters[key as keyof typeof newFilters];
                        
                        if (value === undefined || value === "" || value === "all") {
                            delete updated[key];
                        } else {
                            updated[key] = value as TClientFilters[typeof key];
                        }
                    }
                });
                
                return updated;
            });
            
            setCurrentPage(1);
        } else {
            setServerFilters(prev => ({ ...prev, ...newFilters } as TServerFilters));
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLimitChange = (limit: number) => {
        if (limit === -1) {
            setShowingAll(true);
        } else {
            setShowingAll(false);
            setItemsPerPage(limit);
            setCurrentPage(1);
        }
    };

    return {
        serverFilters,
        clientFilters,
        currentPage,
        itemsPerPage,
        showingAll,
        filteredData,
        paginatedData,
        paginationInfo,
        isLoading,
        error,
        refetch,
        handleFilterChange,
        handlePageChange,
        handleLimitChange,
        allFilters: { ...serverFilters, ...clientFilters }
    };
}