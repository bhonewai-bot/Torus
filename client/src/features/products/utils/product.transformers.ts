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

    console.log("Processing image in transform:", uploadProductImages);

    if (data.images && data.images.length > 0) {
        const filesToUpload = data.images
            .filter((img): img is { file: File; isMain: boolean } => 'file' in img && img.file instanceof File)
            .map(img => ({ file: img.file, isMain: img.isMain || false }));

        console.log("Files to upload:", filesToUpload);

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
                console.error("Failed to upload images:", error);
                throw new Error("Failed to upload images. Please try again.");
            }
        }
    }

    console.log("Final processed images:", processedImages);

    return {
        sku: data.sku,
        title: data.title,
        brand: data.brand || undefined,
        description: data.description || undefined,
        categoryId: data.categoryId || undefined,

        // Flatten dimensions
        length: data.dimensions?.length,
        width: data.dimensions?.width,
        height: data.dimensions?.height,
        weight: data.dimensions?.weight,

        // Flatten pricing
        price: data.pricing?.price ?? 0,
        regularPrice: data.pricing.regularPrice,
        salePrice: data.pricing.salePrice,
        taxRate: data.pricing.taxRate,
        taxIncluded: data.pricing.taxIncluded || false,

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

    console.log("🔍 STEP 1 - Raw form data.images:");
    console.log(JSON.stringify(data.images, null, 2));

    if (data.images && data.images.length > 0) {
        const existingImageUpdates: Array<{ id: string; url: string; isMain: boolean }> = [];
        const filesToUpload: Array<{ file: File; isMain: boolean }> = [];

        data.images.forEach((img, index) => {
            console.log(`🔍 Processing image ${index}:`, img);

            if (img && typeof img === 'object') {
                if ('id' in img && img.id && typeof img.id === 'string') {
                    console.log(`✅ Found existing image: ${img.id}`);
                    existingImageUpdates.push({
                        id: img.id,
                        url: img.url,
                        isMain: img.isMain || false,
                    });
                } 
                // Check if it's a new file upload
                else if ('file' in img && img.file instanceof File) {
                    console.log(`✅ Found new file: ${img.file.name}`);
                    filesToUpload.push({ 
                        file: img.file, 
                        isMain: img.isMain || false 
                    });
                }
                else {
                    console.warn(`⚠️ Unknown image format at index ${index}:`, img);
                }
            }
        });

        console.log("🔍 STEP 2 - Processing existing images:");
        console.log("Existing images to keep:", existingImageUpdates.map(img => img.id));

        existingImageUpdates.forEach(img => {
            processedImages.push({
                id: img.id,
                url: img.url,
                isMain: img.isMain,
            });
        });

        if (filesToUpload.length > 0) {
            console.log("🔍 STEP 3 - Uploading new images:");
            console.log("Files to upload:", filesToUpload.length);

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

                console.log("✅ New images uploaded successfully");
            } catch (error) {
                console.error("❌ Failed to upload new images:", error);
                throw new Error("Failed to upload new images. Please try again");
            }
        }
    }

    console.log("🔍 STEP 4 - Final payload to backend:");
    console.log("Total images to send:", processedImages.length);
    console.log("Images with IDs (existing):", processedImages.filter(img => img.id).map(img => img.id));
    console.log("Images without IDs (new):", processedImages.filter(img => !img.id).length);

    const dto: updateProductDto = {};

    if (data.sku !== undefined) dto.sku = data.sku;
    if (data.title !== undefined) dto.title = data.title;
    if (data.brand !== undefined) dto.brand = data.brand;
    if (data.description !== undefined) dto.description = data.description;
    if (data.categoryId !== undefined) dto.categoryId = data.categoryId;

    // Handle dimensions
    if (data.dimensions) {
        if (data.dimensions.length !== undefined) dto.length = data.dimensions.length;
        if (data.dimensions.width !== undefined) dto.width = data.dimensions.width;
        if (data.dimensions.height !== undefined) dto.height = data.dimensions.height;
        if (data.dimensions.weight !== undefined) dto.weight = data.dimensions.weight;
    }

    // Handle pricing
    if (data.pricing) {
        if (data.pricing.price !== undefined) dto.price = data.pricing.price;
        if (data.pricing.regularPrice !== undefined) dto.regularPrice = data.pricing.regularPrice;
        if (data.pricing.salePrice !== undefined) dto.salePrice = data.pricing.salePrice;
        if (data.pricing.taxRate !== undefined) dto.taxRate = data.pricing.taxRate;
        if (data.pricing.taxIncluded !== undefined) dto.taxIncluded = data.pricing.taxIncluded;
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

    console.log('Rolling back uploaded images:', uploadedFilesForRollback);

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
