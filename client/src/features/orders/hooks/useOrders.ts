import {OrderFilters} from "@/features/orders/types/order.types";
import {useQuery} from "@tanstack/react-query";
import {orderKeys} from "@/features/orders/lib/query.keys";
import {orderService} from "@/features/orders/services/order.service";

export function useOrders(filters: OrderFilters = {}) {
    return useQuery({
        queryKey: orderKeys.list(filters),
        queryFn: () => orderService.getAllOrders(filters),
        staleTime: 1000 * 30,
    })
}