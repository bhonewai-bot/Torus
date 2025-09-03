export class OrderServiceError extends Error {
    constructor(
        message: string,
        public statusCode?: string,
        public originalError?: unknown,
    ) {
        super(message);
        this.name = "OrderServiceError";
    }
}