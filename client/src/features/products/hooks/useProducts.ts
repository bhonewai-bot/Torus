"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {productKeys} from "@/features/products/lib/product.query.keys";
import {productService} from "@/features/products/services/product.service";
import {showError, showSuccess} from "@/lib/utils/toast";
import {
    ProductList, ProductDetails,
    ProductFilters, ProductListResponse,
} from "@/features/products/types/product.types";
import {createProductDto, updateProductDto} from "@/features/products/utils/product.schema";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export function useProducts(filters: ProductFilters = {}) {
    return useQuery<ProductListResponse, Error>({
        queryKey: productKeys.list(filters),
        queryFn: () => productService.getProducts(filters),
        staleTime: 1000 * 30,
    })
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productService.getProduct(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    const { handleError } = useErrorHandler();

    return useMutation({
        mutationFn: (data: createProductDto) => productService.createProduct(data),
        onSuccess: (newProduct: ProductDetails) => {
            // Update the detail cache with the new product
            queryClient.setQueryData(productKeys.detail(newProduct.id), newProduct);

            // Invalidate and refetch product lists to show the new product
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            showSuccess("Product created successfully");
        },
        onError: (error: unknown) => {
            handleError(error, "useCreateProduct")
        }
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    const { handleError } = useErrorHandler();

    return useMutation({
        mutationFn: ({id, data}: { id: string, data: updateProductDto }) => productService.updateProduct(id, data),
        onSuccess: (updatedProduct: ProductDetails, variables) => {
            // Update the detail cache
            queryClient.setQueryData(productKeys.detail(variables.id), updatedProduct);

            // Invalidate list queries to reflect changes
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            showSuccess("Product updated successfully");
        },
        onError: (error: unknown) => {
            handleError(error, 'useUpdateProduct')
        }
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    const { handleError } = useErrorHandler();

    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: (_, deletedId) => {
            // Remove the product from detail cache
            queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });

            // Remove from all list caches
            queryClient.getQueryCache().findAll({
                queryKey: productKeys.lists(),
            }).forEach((query) => {
                queryClient.setQueryData(query.queryKey, (old: ProductListResponse | undefined) => {
                    if (!old || !Array.isArray(old.products)) return old;

                    return {
                        ...old,
                        products: old.products.filter((product) => product.id !== deletedId),
                        total: Math.max(0, old.pagination.total - 1),
                    };
                });
            });

            showSuccess("Product deleted successfully");
        },
        onError: (error: unknown) => {
            handleError(error, "useDeleteProduct");
        },
    });
}
