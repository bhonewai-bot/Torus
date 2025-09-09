import { BaseError } from "@/lib/errors";
import { useCallback, useState } from "react";
import { useErrorHandler } from "./useErrorHandler";

interface ApiOperationState<T> {
    data: T | null;
    loading: boolean;
    error: BaseError | null;
    success: boolean;
}

interface UseApiOperationOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: BaseError) => void;
    resetOnStart?: boolean;
}

export function useApiOperation<T = any>(options: UseApiOperationOptions = {}) {
    const [state, setState] = useState<ApiOperationState<T>>({
        data: null,
        loading: false,
        error: null,
        success: false,
    });

    const { handleError } = useErrorHandler();

    const execute = useCallback(async (
        operation: () => Promise<T>,
        context?: string
    ): Promise<T | null> => {
        if (options.resetOnStart !== false) {
            setState({
                data: null,
                loading: true,
                error: null,
                success: false,
            });
        } else {
            setState(prev => ({ ...prev, loading: true, error: null }));
        }

        try {
            const result = await operation();
            
            setState({
                data: result,
                loading: false,
                error: null,
                success: true,
            });

            if (options.onSuccess) {
                options.onSuccess(result);
            }

            return result;
        } catch (error) {
            const processedError = handleError(error, context) as BaseError;
            
            setState(prev => ({
                ...prev,
                loading: false,
                error: processedError,
                success: false,
            }));

            if (options.onError) {
                options.onError(processedError);
            }

            return null;
        }
    }, [handleError, options]);

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
            success: false,
        });
    }, []);

    return {
        ...state,
        execute,
        reset,
        isLoading: state.loading,
        hasError: !!state.error,
        isSuccess: state.success,
    };
}