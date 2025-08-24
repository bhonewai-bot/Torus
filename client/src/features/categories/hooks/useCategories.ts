"use client";

import {useQuery} from "@tanstack/react-query";
import {categoryKeys} from "@/features/categories/lib/queryKeys";
import {getAllCategories} from "@/features/categories/services/categoryService";

export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: getAllCategories,
        staleTime: 1000 * 60 * 5,
    });
}