import {useQuery} from "@tanstack/react-query";
import {Products} from "@/features/products/components/admin/table/columns";
import {getAllProducts} from "@/features/products/services/productService";

export function useProducts() {
    return useQuery<Products[], Error>({
        queryKey: ["products"],
        queryFn: getAllProducts,
    })
}