import {OrderFilters} from "@/features/orders/types/order.types";
import {useQuery} from "@tanstack/react-query";
import {orderKeys} from "@/features/orders/lib/order.query.keys";
import {orderService} from "@/features/orders/services/order.service";
import { updateOrderStatusDto } from "../utils/order.schema";
import { useOptimisticUpdate } from "@/hooks/useOptimisticUpdate";
import { orderUpdateConfig } from "../config/user.config";

export function useOrders(filters: OrderFilters = {}) {
    return useQuery({
        queryKey: orderKeys.list(filters),
        queryFn: () => orderService.getOrders(filters),
        staleTime: 1000 * 30,
    })
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => orderService.getOrder(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdateOrderStatus(orderId: string) {
    return useOptimisticUpdate({
        entityId: orderId,
        mutationFn: (data: updateOrderStatusDto) => orderService.updateOrderStatus(orderId, data),
        config: orderUpdateConfig.status
    });
}