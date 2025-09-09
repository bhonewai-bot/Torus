import {OrderFilters} from "@/features/orders/types/order.types";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {orderKeys} from "@/features/orders/lib/order.query.keys";
import {orderService} from "@/features/orders/services/order.service";
import { updateOrderStatusDto } from "../utils/order.schema";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { showSuccess } from "@/lib/utils/toast";

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

export function useUpdateOrderStatus(orderId: string) {
    const queryClient = useQueryClient();
    const { handleError } = useErrorHandler();

    return useMutation({
        mutationFn: (data: updateOrderStatusDto) => orderService.updateOrderStatus(orderId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
            queryClient.invalidateQueries({ queryKey: orderKeys.list() });

            showSuccess("Order status updated successfully");
        },
        onError: (error: unknown) => {
            handleError(error, `useUpdateOrderStatus:${orderId}`);
        }
    });
}