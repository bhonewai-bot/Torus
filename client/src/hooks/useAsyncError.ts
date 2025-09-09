import { BaseError } from "@/lib/errors";
import { useCallback, useState } from "react";
import { useErrorHandler } from "./useErrorHandler";

interface AsyncState<T = any> {
    data: T | null;
    loading: boolean;
    error: BaseError | null;
}

export function useAsyncError<T = any>(initialData: T | null = null) {
    const [state, setState] = useState<AsyncState<T>>({
        data: initialData,
        loading: false,
        error: null
    });

    const { handleError } = useErrorHandler();

    const execute = useCallback(async (
        asyncFunction: () => Promise<T>,
        context?: string,
    ): Promise<T | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const result = await asyncFunction();
            setState({ data: result, loading: false, error: null });
            return result;
        } catch (error) {
            const processedError = handleError(error, context);
            setState(prev => ({
                ...prev,
                loading: false,
                error: processedError instanceof BaseError ? processedError : null
            }));
            return null;
        }
    }, [handleError]);

    const reset = useCallback(() => {
        setState({ data: initialData, loading: false, error: null });
    }, [initialData]);

    return {
        ...state,
        execute,
        reset,
    };
}