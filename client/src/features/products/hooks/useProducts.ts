import {QueryClient, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {productKeys} from "@/features/products/lib/queryKeys";
import {ProductFilters, productService} from "@/features/products/services/productService";
import {showError, showSuccess} from "@/lib/utils/toast";
import {CreateProductDto} from "@/features/products/types/product.types";

export function useProducts(filters: ProductFilters = {}) {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: () => productService.getProducts(filters),
        staleTime: 1000 * 30,
        placeholderData: (previousData) => previousData,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useGetProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productService.getProduct(id),
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productService.createProduct,
        onMutate: async (data: CreateProductDto) => {
            return { data };
        },
        onSuccess: (_, data: CreateProductDto) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            showSuccess("Product created successfully");
        },
        onError: (error, variables, context) => {
            console.error("Create product error:", error);
            showError(error.message || "Failed to delete product");

            queryClient.invalidateQueries({ queryKey: productKeys.all });
        }
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productService.deleteProduct,
        onMutate: async (productId) => {
            await queryClient.cancelQueries({ queryKey: productKeys.all });

            return { productId };
        },
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            showSuccess("Product deleted successfully");
        },
        onError: (error, variables, context) => {
            console.error("Delete product error:", error);
            showError(error.message || "Failed to delete product");

            queryClient.invalidateQueries({ queryKey: productKeys.all });
        }
    });
}
