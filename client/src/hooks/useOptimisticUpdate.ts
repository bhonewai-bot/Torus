import { showSuccess } from "@/lib/utils/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useErrorHandler } from "./useErrorHandler";

interface QueryKeys {
    all: readonly unknown[];
    lists: () => readonly unknown[];
    list: (filters: any) => readonly unknown[];
    detail: (id: string) => readonly unknown[];
}

interface UpdateConfig<TData = any> {
    queryKeys: QueryKeys;
    successMessage: string;
    listDataPath: string; // Path to the array in list queries (e.g., "users", "orders")
    mutationKey?: string; // For error handling context
    dataTransform?: (variables: any, oldItem: TData) => TData; // Custom data transformation
}

interface UseOptimisticUpdateParams<TVariables = any, TResponse = any> {
    entityId: string;
    mutationFn: (variables: TVariables) => Promise<TResponse>;
    config: UpdateConfig;
}

export function useOptimisticUpdate<TVariables = any, TResponse = any>({
    entityId,
    mutationFn,
    config
}: UseOptimisticUpdateParams<TVariables, TResponse>) {
    const queryClient = useQueryClient();
    const { handleError } = useErrorHandler();

    return useMutation<TResponse, unknown, TVariables, MutationContext>({
        mutationFn,
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: config.queryKeys.lists() });
            await queryClient.cancelQueries({ queryKey: config.queryKeys.detail(entityId) });

            // Snapshot previous values
            const previousLists = queryClient.getQueriesData({ queryKey: config.queryKeys.lists() });
            const previousDetail = queryClient.getQueryData(config.queryKeys.detail(entityId));

            // Optimistically update list queries
            queryClient.setQueriesData(
                { queryKey: config.queryKeys.lists() },
                (oldData: any) => {
                    const dataArray = oldData?.[config.listDataPath];
                    if (!dataArray) return oldData;

                    return {
                        ...oldData,
                        [config.listDataPath]: dataArray.map((item: any) => {
                            if (item.id === entityId) {
                                // Use custom transform if provided, otherwise merge variables
                                return config.dataTransform 
                                    ? config.dataTransform(variables, item)
                                    : { ...item, ...variables };
                            }
                            return item;
                        })
                    };
                }
            );

            // Optimistically update detail query
            if (previousDetail) {
                queryClient.setQueryData(
                    config.queryKeys.detail(entityId),
                    (oldData: any) => {
                        return config.dataTransform 
                            ? config.dataTransform(variables, oldData)
                            : { ...oldData, ...variables };
                    }
                );
            }

            return { previousLists, previousDetail };
        },
        onSuccess: () => {
            // Invalidate queries to ensure fresh data from server
            queryClient.invalidateQueries({ queryKey: config.queryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: config.queryKeys.detail(entityId) });
            queryClient.invalidateQueries({ queryKey: config.queryKeys.all });

            showSuccess(config.successMessage);
        },
        onError: (error: unknown, variables, context) => {
            // Rollback optimistic updates
            if (context?.previousLists) {
                context.previousLists.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            if (context?.previousDetail) {
                queryClient.setQueryData(config.queryKeys.detail(entityId), context.previousDetail);
            }

            // Handle error with context for debugging
            const errorContext = config.mutationKey ? `${config.mutationKey}:${entityId}` : `update:${entityId}`;
            handleError(error, errorContext);
        }
    });
}