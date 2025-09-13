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
            route: typeof window !== 'undefined' ? window.location.pathname : undefined,
        });

        console.log("Processed error:", processedError); // Debug log
        console.log("Error code:", processedError.errorCode); // Debug log
        console.log("Error message:", processedError.message); 

        if (processedError instanceof BaseError) {
            const userMessage = getUserFriendlyMessage(processedError);
            console.log("User message:", userMessage);
            toast.error(userMessage);
        } else {
            toast.error("An unexpected error occurred.");
        }

        return processedError;
    }, []);

    return { handleError };
}

function getUserFriendlyMessage(error: BaseError): string {
    // Always prioritize the actual error message for these specific cases
    // because the server usually provides helpful, user-friendly messages
    const directMessageCodes = [
        'CONFLICT',
        'BAD_REQUEST', 
        'VALIDATION_ERROR',
        'NOT_FOUND'
    ];

    if (directMessageCodes.includes(error.errorCode)) {
        // Return the actual server message - it's usually user-friendly
        return error.message;
    }

    // For other error codes, provide generic user-friendly messages
    const messageMap: Record<string, string> = {
        'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
        'TIMEOUT_ERROR': 'Request timed out. Please try again.',
        'UNAUTHORIZED': 'Please log in to access this feature.',
        'FORBIDDEN': 'You do not have permission to perform this action.',
        'INTERNAL_SERVER_ERROR': 'Server error occurred. Please try again later.',
        'SERVICE_UNAVAILABLE': 'Service is temporarily unavailable. Please try again later.',
        'BAD_GATEWAY': 'Server connection issue. Please try again.',
        'GATEWAY_TIMEOUT': 'Server response timeout. Please try again.',
        'PRODUCT_SERVICE_ERROR': 'Failed to process product request. Please try again.',
        'CATEGORY_SERVICE_ERROR': 'Failed to process category request. Please try again.',
        'ORDER_SERVICE_ERROR': 'Failed to process order request. Please try again.',
        'UPLOAD_SERVICE_ERROR': 'Failed to upload file. Please try again.',
    };

    // Return mapped message, or fall back to the original error message, or generic message
    return messageMap[error.errorCode] || error.message || "An unexpected error occurred.";
}