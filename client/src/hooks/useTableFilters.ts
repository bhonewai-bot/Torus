import {useState} from "react";

export function useTableFilters<TFilters>(initFilters: TFilters) {
    const [filters, setFilters] = useState(initFilters);

    const updatedFilters = (updates: Partial<TFilters>) => {
        setFilters(prev => ({ ...prev, ...updates }));
    }

    const resetFilters = () => {
        setFilters(initFilters);
    }

    return {
        filters,
        updatedFilters,
        resetFilters
    }
}