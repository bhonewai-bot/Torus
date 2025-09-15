import {deleteProductImage, uploadProductImages} from "@/features/products/services/image.upload.service";
import {ExistingImage} from "@/features/products/types/image.types";
import {
    createProductDto,
    createProductFormData,
    updateProductDto,
    updateProductFormData
} from "@/features/products/utils/product.schema";

let uploadedFilesForRollback: string[] = [];

export async function transformCreateFormDataToDto(data: createProductFormData):Promise<createProductDto> {
    let processedImages: Array<{
        url: string;
        filename?: string;
        originalName?: string;
        size?: number;
        isMain: boolean;
    }> = [];

    uploadedFilesForRollback = [];

    if (data.images && data.images.length > 0) {
        const filesToUpload = data.images
            .filter((img): img is { file: File; isMain: boolean } => 'file' in img && img.file instanceof File)
            .map(img => ({ file: img.file, isMain: img.isMain || false }));

        if (filesToUpload.length > 0) {
            try {
                const files = filesToUpload.map(item => item.file);
                const uploadedImages = await uploadProductImages(files);

                // Store filenames for potential rollback
                uploadedFilesForRollback = uploadedImages.map(image => image.filename);


                // Map uploaded images with their isMain flags
                processedImages = uploadedImages.map((uploaded, index) => ({
                    url: uploaded.url,
                    filename: uploaded.filename,
                    originalName: uploaded.originalName,
                    size: uploaded.size,
                    isMain: filesToUpload[index]?.isMain || false,
                }));
            } catch (error) {
                throw new Error("Failed to upload images. Please try again.");
            }
        }
    }

    return {
        sku: data.sku,
        title: data.title,
        description: data.description || undefined,
        categoryId: data.categoryId || undefined,

        // Flatten pricing
        price: data.pricing?.price ?? 0,

        // Flatten inventory
        quantity: data.inventory.quantity,

        // Processed images and status
        images: processedImages,
        status: data.status,
    };
}

export async function transformUpdateFormDataToDto(
    data: updateProductFormData,
    existingImages: ExistingImage[] = [],
): Promise<updateProductDto> {
    const processedImages: Array<{
        id?: string;
        url: string;
        filename?: string;
        originalName?: string;
        size?: number;
        isMain: boolean;
    }> = [];

    uploadedFilesForRollback = [];

    if (data.images && data.images.length > 0) {
        const existingImageUpdates: Array<{ id: string; url: string; isMain: boolean }> = [];
        const filesToUpload: Array<{ file: File; isMain: boolean }> = [];

        data.images.forEach((img, index) => {

            if (img && typeof img === 'object') {
                if ('id' in img && img.id && typeof img.id === 'string') {
                    existingImageUpdates.push({
                        id: img.id,
                        url: img.url,
                        isMain: img.isMain || false,
                    });
                } 
                // Check if it's a new file upload
                else if ('file' in img && img.file instanceof File) {
                    filesToUpload.push({ 
                        file: img.file, 
                        isMain: img.isMain || false 
                    });
                }
                else {
                }
            }
        });

        existingImageUpdates.forEach(img => {
            processedImages.push({
                id: img.id,
                url: img.url,
                isMain: img.isMain,
            });
        });

        if (filesToUpload.length > 0) {

            try {
                const files = filesToUpload.map(item => item.file);
                const uploadedImages = await uploadProductImages(files);

                uploadedFilesForRollback = uploadedImages.map(img => img.filename);

                uploadedImages.forEach((uploaded, index) => {
                    processedImages.push({
                        url: uploaded.url,
                        filename: uploaded.filename,
                        originalName: uploaded.originalName,
                        size: uploaded.size,
                        isMain: filesToUpload[index]?.isMain || false,
                    });
                });

            } catch (error) {
                throw new Error("Failed to upload new images. Please try again");
            }
        }
    }

    const dto: updateProductDto = {};

    if (data.sku !== undefined) dto.sku = data.sku;
    if (data.title !== undefined) dto.title = data.title;
    if (data.description !== undefined) dto.description = data.description;
    if (data.categoryId !== undefined) dto.categoryId = data.categoryId;

    // Handle pricing
    if (data.pricing) {
        if (data.pricing.price !== undefined) dto.price = data.pricing.price;
    }

    // Handle inventory
    if (data.inventory?.quantity !== undefined) dto.quantity = data.inventory.quantity;

    // Handle images and status
    dto.images = processedImages;
    if (data.status !== undefined) dto.status = data.status;

    return dto;
}

// Function to rollback uploaded images on form error
export async function rollbackUploadedImages(): Promise<void> {
    if (uploadedFilesForRollback.length === 0) return;


    const deletePromises = uploadedFilesForRollback.map(filename => 
        deleteProductImage(filename).catch(error => {
            console.error(`Failed to delete ${filename} during rollback:`, error);
        })
    );

    await Promise.allSettled(deletePromises);
    uploadedFilesForRollback = [];
}

// Clear rollback data on successful form submission
export function clearUploadRollbackData(): void {
    uploadedFilesForRollback = [];
}
