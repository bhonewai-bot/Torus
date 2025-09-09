"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {categoryKeys} from "@/features/categories/lib/category.query.keys";
import {categoryService} from "@/features/categories/services/categoryService";
import {showError, showSuccess} from "@/lib/utils/toast";
import { createCategoryDto } from "../utils/category.schema";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: () => categoryService.getAllCategories(),
        staleTime: 1000 * 60 * 5,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    const { handleError } = useErrorHandler();

    return useMutation({
        mutationFn: (data: createCategoryDto) => categoryService.createCategory(data),
        onSuccess: (newCategory: Category) => {
            queryClient.setQueryData(categoryKeys.list(), (old: Category[] | undefined) => {
                if (!old) return [newCategory];
                return [...old, newCategory];
            })

            queryClient.invalidateQueries({ queryKey: categoryKeys.all });

            showSuccess("Category created successfully");
        },
        onError: (error: unknown) => {
            handleError(error, "useCreateCategory")
        }
    })
}