export class CategoryServiceError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public originalError?: unknown,
    ) {
        super(message);
        this.name = "CategoryServiceError";
    }
}