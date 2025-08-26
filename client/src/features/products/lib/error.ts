export class ProductServiceError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public originalError?: unknown,
    ) {
        super(message);
        this.name = "ProductServiceError";
    }
}

export class UploadServiceError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public originalError?: unknown,
    ) {
        super(message);
        this.name = "UploadServiceError";
    }
}