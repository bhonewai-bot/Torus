"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {categoryKeys} from "@/features/categories/lib/category.query.keys";
import {categoryService} from "@/features/categories/services/categoryService";
import {showSuccess} from "@/lib/utils/toast";

export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: () => categoryService.getAllCategories(),
        staleTime: 1000 * 60 * 5,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => categoryService.createCategory(data),
        onSuccess: (newCategory: Category) => {
            queryClient.setQueryData(categoryKeys.details(newCategory.id), newCategory);

            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });

            showSuccess("Category created successfully");
        },
    })
}