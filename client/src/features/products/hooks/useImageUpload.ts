import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { deleteProductImage, uploadProductImages, uploadSingleImage, validateMultipleFiles } from "../services/image.upload.service";
import { showSuccess } from "@/lib/utils/toast";

export function useUploadImages() {
    const { handleError } = useErrorHandler();

    return useMutation({
        mutationFn: (files: File[]) => uploadProductImages(files),
        onSuccess: (images) => {
            showSuccess(`Successfully uploaded ${images.length} image(s)`);
        },
        onError: (error: unknown) => {
            handleError(error, 'useUploadImages');
        }
    });
}

export function useUploadSingleImage() {
    const { handleError } = useErrorHandler();

    return useMutation({
        mutationFn: (file: File) => uploadSingleImage(file),
        onSuccess: (image) => {
            showSuccess("Image uploaded successfully");
        },
        onError: (error: unknown) => {
            handleError(error, 'useUploadSingleImage');
        }
    });
}

export function useDeleteImage() {
    const { handleError } = useErrorHandler();

    return useMutation({
        mutationFn: (filename: string) => deleteProductImage(filename),
        onSuccess: (success) => {
            if (success) {
                showSuccess("Image deleted successfully");
            }
        },
        onError: (error: unknown) => {
            handleError(error, 'useDeleteImage');
        }
    });
}

// Validation hook for client-side file validation
export function useFileValidation() {
    const { handleError } = useErrorHandler();

    const validateFiles = (files: File[]) => {
        try {
            return validateMultipleFiles(files);
        } catch (error) {
            handleError(error, 'useFileValidation');
            return { valid: [], invalid: [] };
        }
    };

    return { validateFiles };
}