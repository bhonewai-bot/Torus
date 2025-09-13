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
            queryClient.getQueriesData({ queryKey: productKeys.lists() }).forEach(([queryKey, data]) => {
                if (data && typeof data === 'object' && 'products' in data) {
                    const currentData = data as ProductListResponse;
                    
                    const updatedProducts = currentData.products.filter(
                        (product) => product.id !== deletedId
                    );
                    
                    const updatedData = {
                        ...currentData,
                        products: updatedProducts,
                        pagination: {
                            ...currentData.pagination,
                            total: Math.max(0, currentData.pagination.total - 1),
                        }
                    };

                    queryClient.setQueryData(queryKey, updatedData);
                }
            });

            // Invalidate queries to ensure fresh data
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            showSuccess("Product deleted successfully");
        },
        onError: (error: unknown) => {
            handleError(error, "useDeleteProduct");
        },
    });
}

export function useBulkDeleteProducts() {
    const queryClient = useQueryClient();
    const { handleError } = useErrorHandler();

    return useMutation({
        mutationFn: (ids: string[]) => productService.bulkDeleteProducts(ids),
        onSuccess: (_, deletedIds) => {
            // Remove the products from detail cache
            deletedIds.forEach((id) => {
                queryClient.removeQueries({ queryKey: productKeys.detail(id) });
            });

            // Remove from all list caches
            queryClient.getQueriesData({ queryKey: productKeys.lists() }).forEach(([queryKey, data]) => {
                if (data && typeof data === 'object' && 'products' in data) {
                    const currentData = data as ProductListResponse;
                    
                    const updatedProducts = currentData.products.filter(
                        (product) => !deletedIds.includes(product.id)
                    );
                    
                    const updatedData = {
                        ...currentData,
                        products: updatedProducts,
                        pagination: {
                            ...currentData.pagination,
                            total: Math.max(0, currentData.pagination.total - deletedIds.length),
                        }
                    };

                    queryClient.setQueryData(queryKey, updatedData);
                }
            });

            // Invalidate queries to ensure fresh data
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            showSuccess("Products deleted successfully");
        },
        onError: (error: unknown) => {
            handleError(error, "useBulkDeleteProducts");
        }
    });
}