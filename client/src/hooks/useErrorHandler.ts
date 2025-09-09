import { BaseError, ErrorHandler } from "@/lib/errors";
import { useCallback } from "react";
import { toast } from "sonner";

const errorHandler = new ErrorHandler({
    enableLogging: true,
    logLevel: "error",
    enableNotification: false,
});

export function useErrorHandler() {
    const handleError = useCallback((error: unknown, context?: string) => {
        const processedError = errorHandler.handle(error, {
            context: context || "unknown",
            route: window.location.pathname,
        });

        if (processedError instanceof BaseError) {
            const userMessage = getUserFriendlyMessage(processedError);
            toast.error(userMessage);
        } else {
            toast.error("An unexpected error occurred.");
        }

        return processedError;
    }, []);

    return { handleError };
}

function getUserFriendlyMessage(error: BaseError): string {
    const messageMap: Record<string, string> = {
        'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
        'TIMEOUT_ERROR': 'Request timed out. Please try again.',
        'VALIDATION_ERROR': 'Please check your input and try again.',
        'NOT_FOUND': 'The requested resource was not found.',
        'UNAUTHORIZED': 'Please log in to access this feature.',
        'FORBIDDEN': 'You do not have permission to perform this action.',
        'PRODUCT_SERVICE_ERROR': 'Failed to process product request. Please try again.',
        'CATEGORY_SERVICE_ERROR': 'Failed to process category request. Please try again.',
        'ORDER_SERVICE_ERROR': 'Failed to process order request. Please try again.',
        'UPLOAD_SERVICE_ERROR': 'Failed to upload file. Please try again.',
    }

    return messageMap[error.errorCode] || error.message || "An unexpected error occurred.";
}