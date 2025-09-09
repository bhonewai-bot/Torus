import {ImageUploadResponse, UploadedImage} from "@/features/products/types/image.types";
import api from "@/lib/api/client";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import { ErrorFactory, ErrorHandler, ValidationError } from "@/lib/errors";

const errorHandler = new ErrorHandler();

export async function uploadProductImages(files: File[]): Promise<UploadedImage[]> {
    if (!files.length) {
        throw ErrorFactory.createValidationError(
            [{ field: "images", message: "At least one image is required", code: "required" }],
            "No files provided for upload",
            { operation: "uploadProductImages" }
        );
    }

    try {
        const { valid, invalid } = validateMultipleFiles(files);

        if (invalid.length > 0) {
            const validationIssues = invalid.map(({ file, error }) => ({
                field: 'files',
                message: `${file.name}: ${error}`,
                code: 'invalid_file',
                value: file.name
            }));

            throw ErrorFactory.createValidationError(
                validationIssues,
                "File validation failed",
                { operation: 'uploadProductImages', invalidFiles: invalid.length }
            );
        }

        const formData = new FormData();
        valid.forEach((file) => {
            formData.append("images", file);
        });

        const response = await api.post<ImageUploadResponse>(
            API_ENDPOINTS.admin.images.create,
            formData
        );

        return response.data.data.images;
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createServiceError(
            "upload",
            "Failed to upload images",
            (error as any).statusCode || 500,
            error,
            {
                operation: 'uploadProductImages',
                endpoint: API_ENDPOINTS.admin.images.create,
                fileCount: files.length
            }
        );
        throw errorHandler.handle(processedError);
    }
}

export async function deleteProductImage(filename: string): Promise<boolean> {
    if (!filename) {
        throw ErrorFactory.createValidationError(
            [{ field: "filename", message: "Filename is required", code: "required" }],
            "Filename validation failed",
            { operation: "deleteProductImage" }
        );
    }
    
    try {
        const response = await api.delete(
            API_ENDPOINTS.admin.images.delete(filename)
        );

        return response.data.success;
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }

        const processedError = ErrorFactory.createServiceError(
            "upload",
            "Failed to delete image",
            (error as any).statusCode || 500,
            error,
            {
                operation: 'deleteProductImage',
                endpoint: API_ENDPOINTS.admin.images.delete(filename),
                filename
            }
        );
        
        // For delete operations, we might want to be less strict and return false instead of throwing
        errorHandler.handle(processedError);
        return false;
    }
}

export async function uploadSingleImage(file: File): Promise<UploadedImage> {
    const result = await uploadProductImages([file]);

    if (!result.length) {
        throw ErrorFactory.createServiceError(
            "upload",
            "No image was uploaded",
            422,
            undefined,
            { operation: 'uploadSingleImage', fileName: file.name }
        );
    }
    return result[0];
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!file.type.startsWith("image/")) {
        return { valid: false, error: "File must be an image" };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        return { valid: false, error: "File size must be less than 5MB" };
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: "File type not supported. Use JPEG, PNG, WEBP, or GIF" }
    }

    return { valid: true };
}

/**
 * Extract filename from uploaded image URL
 */
export function extractFilenameFromUrl(url: string): string | null {
    try {
        const urlParts = url.split("/");
        return urlParts[urlParts.length -1] || null;
    } catch {
        return null;
    }
}

/**
 * Batch validate multiple files
 */
export function validateMultipleFiles(files: File[]): {
    valid: File[];
    invalid: Array<{ file: File; error: string }>
} {
    const valid: File[] = [];
    const invalid: Array<{ file: File; error: string }> = [];

    files.forEach((file) => {
        const validation = validateImageFile(file);
        if (validation.valid) {
            valid.push(file);
        } else {
            invalid.push({ file, error: validation.error! });
        }
    });

    return { valid, invalid };
}
