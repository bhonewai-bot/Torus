import {OrderFilters} from "@/features/orders/types/order.types";
import {useQuery} from "@tanstack/react-query";
import {orderKeys} from "@/features/orders/lib/order.query.keys";
import {orderService} from "@/features/orders/services/order.service";

export function useOrders(filters: OrderFilters = {}) {
    return useQuery({
        queryKey: orderKeys.list(filters),
        queryFn: () => orderService.getAllOrders(filters),
        staleTime: 1000 * 30,
    })
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => orderService.getOrderById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}