import {ImageUploadResponse, UploadedImage} from "@/features/products/types/image.types";
import api from "@/lib/api/client";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import {UploadServiceError} from "@/features/products/lib/product.error";

function handleApiError(error: unknown, context: string): never {
    console.error(`${context}:`, error);

    if (error instanceof Error) {
        if ("response" in error && typeof error.response === "object" && error.response) {
            const response = error.response as any;
            const message = response.data?.message || response.statusText || error.message;
            const statusCode = response.status;

            throw new UploadServiceError(message, statusCode, error);
        }
        throw new UploadServiceError(error.message, undefined, error);
    }
    throw new UploadServiceError(`Unknown error occurred in ${context}`, undefined, error);
}

/**
 * Upload multiple images to local storage
 */
export async function uploadProductImages(files: File[]): Promise<UploadedImage[]> {
    if (!files.length) return [];

    try {
        const formData = new FormData();

        files.forEach((file) => {
            console.log("Appending file:", file.name, file.size, file.type);
            formData.append("images", file);
        });

        console.log("FormData entries:", [...formData.entries()])

        const response = await api.post<ImageUploadResponse>(
            API_ENDPOINTS.admin.images.create,
            formData
        );

        return response.data.data.images;
    } catch (error) {
        handleApiError(error, "Failed to upload images");
    }
}

/**
 * Delete uploaded image
 */
export async function deleteProductImage(filename: string): Promise<boolean> {
    try {
        const response = await api.delete(
            API_ENDPOINTS.admin.images.delete(filename)
        );

        return response.data.success;
    } catch (error) {
        console.error("Image delete error:", error);
        return false;
    }
}

/**
 * Upload single image
 */
export async function uploadSingleImage(file: File): Promise<UploadedImage> {
    const result = await uploadProductImages([file]);

    if (!result.length) {
        throw new Error("No image wa uploaded");
    }
    return result[0];
}

/**
 * Validate image file before upload
 */
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
