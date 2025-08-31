import {CreateProductFormData, UpdateProductFormData} from "@/features/products/schemas/product.schema";
import {uploadProductImages} from "@/features/products/services/image.upload.service";
import {ExistingImage, UpdateImage, UploadedImage} from "@/features/products/types/image.types";
import {CreateProductDto, UpdateProductDto} from "@/features/products/types/dto/product.dto";

/**
 * Transform nested form data to flat DTO structure for API
 */
export async function transformCreateFormDataToDto(data: CreateProductFormData):Promise<CreateProductDto>  {
    let processedImages: UploadedImage[] = [];

    if (data.images && data.images.length > 0) {
        // Extract File objects from form data
        const filesToUpload = data.images
            .filter((img) => img.file)
            .map((img) => img.file!) as File[];

        if (filesToUpload.length > 0) {
            try {
                // Upload images and get real URLs from backend
                const uploadedImages = await uploadProductImages(filesToUpload);

                // Map uploaded images back to the form structure, preserving isMain
                processedImages = uploadedImages.map((uploaded, index) => {
                    const formImage = data.images!.find((img, imgIndex) =>
                        img.file && imgIndex === index
                    );

                    return {
                        url: uploaded.url,
                        filename: uploaded.filename,
                        originalName: uploaded.originalName,
                        size: uploaded.size,
                        isMain: uploaded?.isMain || false,
                    }
                });
            } catch (error) {
                console.error("Failed to upload images:", error);
                throw new Error("Failed to upload images. Please try again.");
            }
        }
    }


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
        price: data.pricing.price,
        regularPrice: data.pricing.regularPrice,
        salePrice: data.pricing.salePrice,
        taxRate: data.pricing.taxRate,
        taxIncluded: data.pricing.taxIncluded,

        // Flatten inventory
        quantity: data.inventory.quantity,

        // Keep images and isActive as-is
        images: processedImages,
        isActive: data.isActive,
    }
}

/**
 * Transform flat API response to nested form structure for editing
 */
export async function transformUpdateFormDataToDto(
    data: UpdateProductFormData,
    existingImages: ExistingImage[] = [],
): Promise<UpdateProductDto> {
    let processedImages: UpdateImage[] = [];

    if (data.images && data.images.length > 0) {
        const existingImageUpdates: UpdateImage[] = [];
        const newFilesUpload: File[] = [];
        const newFileMetadata: Array<{ file: File, isMain: boolean }> = [];

        data.images.forEach((img, index) => {
            if ("id" in img && img.id) {
                existingImageUpdates.push({
                    id: img.id,
                    url: img.url,
                    isMain: img.isMain || false,
                });
            } else if (img.file) {
                 newFilesUpload.push(img.file);
                 newFileMetadata.push({
                     file: img.file,
                     isMain: img.isMain || false,
                 });
            }
        });

        processedImages.push(...existingImageUpdates);

        if (newFilesUpload.length > 0) {
            try {
                const uploadedImages = await uploadProductImages(newFilesUpload);

                const newImageDtos: UpdateImage[] = uploadedImages.map((uploaded, index) => ({
                    url: uploaded.url,
                    isMain: newFileMetadata[index]?.isMain || false,
                }));

                processedImages.push(...newImageDtos);
            } catch (error) {
                console.error("Failed to upload new images:", error);
                throw new Error("Failed to upload new images. Please try again");
            }
        }
    }

    return {
        sku: data.sku,
        title: data.title,
        brand: data.brand,
        description: data.description,
        categoryId: data.categoryId,

        // Flatten dimensions
            length: data.dimensions?.length,
            width: data.dimensions?.width,
            height: data.dimensions?.height,
            weight: data.dimensions?.weight,

        // Flatten pricing
        price: data.pricing?.price,
        regularPrice: data.pricing?.regularPrice,
        salePrice: data.pricing?.salePrice,
        taxRate: data.pricing?.taxRate,
        taxIncluded: data.pricing?.taxIncluded,

        // Nest inventory
        quantity: data.inventory?.quantity,

        // Transform images (exclude id for form)
        images: processedImages,
        isActive: data.isActive,
    };
}