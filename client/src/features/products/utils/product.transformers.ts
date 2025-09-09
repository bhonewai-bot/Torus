import {uploadProductImages} from "@/features/products/services/image.upload.service";
import {ExistingImage} from "@/features/products/types/image.types";
import {
    createProductDto,
    createProductFormData,
    updateProductDto,
    updateProductFormData
} from "@/features/products/utils/product.schema";

export async function transformCreateFormDataToDto(data: createProductFormData):Promise<createProductDto> {
    let processedImages: Array<{
        url: string;
        filename?: string;
        originalName?: string;
        size?: number;
        isMain: boolean;
    }> = [];

    console.log("Processing images in transform:", data.images);

    if (data.images && data.images.length > 0) {
        const filesToUpload = data.images
            .filter((img): img is { file: File; isMain: boolean } => 'file' in img && img.file instanceof File)
            .map(img => ({ file: img.file, isMain: img.isMain || false }));

        console.log("Files to upload:", filesToUpload);

        if (filesToUpload.length > 0) {
            try {
                const files = filesToUpload.map(item => item.file);
                const uploadedImages = await uploadProductImages(files);

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

    console.log("Processing update images:", data.images);

    if (data.images && data.images.length > 0) {
        const existingImageUpdates: Array<{ id: string; url: string; isMain: boolean }> = [];
        const filesToUpload: Array<{ file: File; isMain: boolean }> = [];

        data.images.forEach((img) => {
            if ('id' in img && img.id) {
                // Existing image with ID
                existingImageUpdates.push({
                    id: img.id,
                    url: img.url,
                    isMain: img.isMain || false,
                });
            } else if ('file' in img && img.file instanceof File) {
                // New file upload
                filesToUpload.push({ file: img.file, isMain: img.isMain || false });
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
                console.error("Failed to upload new images:", error);
                throw new Error("Failed to upload new images. Please try again");
            }
        }
    }

    console.log("Final update processed images:", processedImages);

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
    if (processedImages.length > 0) dto.images = processedImages;
    if (data.status !== undefined) dto.status = data.status;

    return dto;
}