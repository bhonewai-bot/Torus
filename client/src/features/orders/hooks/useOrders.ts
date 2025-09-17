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
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: orderKeys.lists() });
            await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

            // Snapshot previous values
            const previousOrderLists = queryClient.getQueriesData({ queryKey: orderKeys.lists() });
            const previousOrderDetail = queryClient.getQueryData(orderKeys.detail(orderId));

            // Optimistically update order lists
            queryClient.setQueriesData(
                { queryKey: orderKeys.lists() },
                (oldData: any) => {
                    if (!oldData?.orders) return oldData;
                    
                    return {
                        ...oldData,
                        orders: oldData.orders.map((order: any) => 
                            order.id === orderId 
                                ? { ...order, ...variables }
                                : order
                        )
                    };
                }
            );

            // Optimistically update order detail
            if (previousOrderDetail) {
                queryClient.setQueryData(
                    orderKeys.detail(orderId),
                    (oldData: any) => ({ ...oldData, ...variables })
                );
            }

            return { previousOrderLists, previousOrderDetail };
        },
        onSuccess: () => {
            // Invalidate to ensure we have fresh data from server
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.all });

            showSuccess("Order status updated successfully");
        },
        onError: (error: unknown, variables, context) => {
            // Rollback optimistic updates
            if (context?.previousOrderLists) {
                context.previousOrderLists.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            if (context?.previousOrderDetail) {
                queryClient.setQueryData(orderKeys.detail(orderId), context.previousOrderDetail);
            }
            
            handleError(error, `useUpdateOrderStatus:${orderId}`);
        }
    });
}