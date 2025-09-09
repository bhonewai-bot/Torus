import { BaseError, ValidationError } from "@/lib/errors";
import { useFormError } from "./useFormError";
import { useErrorHandler } from "./useErrorHandler";
import { useCallback } from "react";

interface UseFormWithErrorOptions {
    onSuccess?: () => void;
    onError?: (error: BaseError) => void;
    showToast?: boolean;
}

export function useFormWithError(options: UseFormWithErrorOptions = {}) {
    const formError = useFormError();
    const { handleError } = useErrorHandler();

    const handleSubmit = useCallback(async <T>(
        submitFn: () => Promise<T>,
        context?: string
    ): Promise<T | null> => {
        // Clear previous errors
        formError.clearErrors();

        try {
            const result = await submitFn();
            
            if (options.onSuccess) {
                options.onSuccess();
            }
            
            return result;
        } catch (error) {
            let processedError: BaseError;

            // Handle validation errors specifically for forms
            if (error instanceof ValidationError) {
                formError.handleError(error);
                processedError = error;
            } else {
                // Handle other errors with global error handler
                processedError = handleError(error, context) as BaseError;
                formError.handleError(processedError);
            }

            if (options.onError) {
                options.onError(processedError);
            }

            return null;
        }
    }, [formError, handleError, options]);

    return {
        ...formError,
        handleSubmit,
    };
}