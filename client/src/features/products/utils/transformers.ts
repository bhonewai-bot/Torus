import {CreateProductFormData} from "@/features/products/schemas/product.schema";
import {CreateProductDto} from "@/features/products/types/product.types";
import {uploadProductImages} from "@/features/products/services/image.upload.service";

/**
 * Transform nested form data to flat DTO structure for API
 */
export async function transformFormDataToDto(data: CreateProductFormData):Promise<CreateProductDto>  {
    let processedImages: any[] = [];

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
export function transformProductToFormData(product: ProductDetails): CreateProductFormData {
    return {
        sku: product.sku,
        title: product.title,
        brand: product.brand || '',
        description: product.description || '',
        categoryId: product.category?.id || '',

        // Nest dimensions
        dimensions: {
            length: product.dimensions?.length,
            width: product.dimensions?.width,
            height: product.dimensions?.height,
            weight: product.dimensions?.weight,
        },

        // Nest pricing
        pricing: {
            price: product.pricing.price,
            regularPrice: product.pricing.regularPrice,
            salePrice: product.pricing.salePrice,
            taxRate: product.pricing.taxRate,
            taxIncluded: product.pricing.taxIncluded || false,
        },

        // Nest inventory
        inventory: {
            quantity: product.inventory.quantity,
        },

        // Transform images (exclude id for form)
        images: product.images.map(img => ({
            url: img.url,
            isMain: img.isMain,
        })),

        isActive: product.isActive,
    };
}

/**
 * Validate that required fields are present in form data
 */
export function validateFormData(data: CreateProductFormData): boolean {
    return !!(
        data.sku?.trim() &&
        data.title?.trim() &&
        data.pricing?.price > 0 &&
        data.inventory?.quantity >= 0
    );
}