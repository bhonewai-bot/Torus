"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {productKeys} from "@/features/products/lib/query.keys";
import {productService} from "@/features/products/services/product.service";
import {showError, showSuccess} from "@/lib/utils/toast";
import {
    CreateProductDto,
    Product, ProductDetails,
    ProductFilters,
    ProductsListResponse,
    UpdateProductDto
} from "@/features/products/types/product.types";
import {ProductServiceError} from "@/features/products/lib/error";

export function useProducts(filters: ProductFilters = {}) {
    return useQuery({
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

    return useMutation({
        mutationFn: (data: CreateProductDto) => productService.createProduct(data),
        onSuccess: (newProduct: Product) => {
            // Update the detail cache with the new product
            queryClient.setQueryData(productKeys.detail(newProduct.id), newProduct);

            // Invalidate and refetch product lists to show the new product
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            showSuccess("Product created successfully");
        },
        onError: (error: ProductServiceError) => {
            const message = error instanceof ProductServiceError
                ? error.message
                : "Failed to create product";

            showError(message);
        }
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, data}: { id: string, data: UpdateProductDto }) => productService.updateProduct(id, data),
        onSuccess: (updatedProduct: ProductDetails, variables) => {
            // Update the detail cache
            queryClient.setQueryData(productKeys.detail(variables.id), updatedProduct);

            // Invalidate list queries to reflect changes
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            showSuccess("Product updated successfully");
        },
        onError: (error: ProductServiceError) => {
            const message = error instanceof ProductServiceError
                ? error.message
                : "Failed to update product";
            showError(message);
        }
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: (_, deletedId) => {
            // Remove the product from detail cache
            queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });

            // Remove from all list caches
            queryClient.getQueryCache().findAll({
                queryKey: productKeys.lists(),
            }).forEach((query) => {
                queryClient.setQueryData(query.queryKey, (old: ProductsListResponse | undefined) => {
                    if (!old || !Array.isArray(old.products)) return old;

                    return {
                        ...old,
                        products: old.products.filter((product) => product.id !== deletedId),
                        total: Math.max(0, old.total - 1),
                    };
                });
            });

            showSuccess("Product deleted successfully");
        },
        onError: (error: ProductServiceError) => {
            const message = error instanceof ProductServiceError
                ? error.message
                : "Failed to delete product";

            showError(message);
        },
    });
}
