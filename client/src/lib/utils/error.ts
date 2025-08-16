export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export function handleApiError(error: any): ApiError {
    if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || error.response.statusText || "An error occurred";
        return new ApiError(message, error.response.status, error.response.data?.code);
    } else if (error.request) {
        // Network error
        return new ApiError("Network error. Please check your connection.", 0, "NETWORK_ERROR");
    } else {
        // Something else happened
        return new ApiError(error.message || "An unexcepted error occurred");
    }
}