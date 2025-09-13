import path from "path";
import fs from "fs/promises";
import { ProductImage } from "../../generated/prisma";
import * as process from "node:process";
import { updateProductImageDto } from "./product/product.schema";


/**
 * Split images into groups
 */
export function splitImages(images: updateProductImageDto[]) {
    const existingImages = images.filter((img) => img.id);
    const newImages = images.filter((img) => !img.id);
    const existingImagesId = existingImages.map(img => img.id!);

    return { existingImages, newImages, existingImagesId };
}

/**
 * Extract filename from full URL
 */
export function extractFilenameFromUrl(url: string): string | null {
    try {
        const urlParts =url.split("/");
        return urlParts[urlParts.length - 1] || null; 
    } catch {
        return null;
    }
}

/**
 * Find images to delete
 */
export function findImagesToDelete(
    existingProductImages: ProductImage[],
    keepImageIds: string[]
) {
    return existingProductImages.filter((img) => !keepImageIds.includes(img.id));
}

/**
 * Delete files from local storage
 */
export async function deleteImageFiles(images: ProductImage[]) {
    await Promise.all(
        images.map(async (img) =>{
            try {
                const filename = extractFilenameFromUrl(img.url);
                if (filename) {
                    const filePath = path.join(process.cwd(), "uploads", "products", filename);
                    await fs.unlink(filePath);
                }
            } catch (error) {
                console.error(`⚠️ Failed to delete file for image: ${img.url}`, error);
            }
        })
    )
}

/**
 * Check if image file exists
 */
export async function imageFileExists(filename: string): Promise<boolean> {
    try {
        const filePath = path.join(process.cwd(), "uploads", "products", filename);
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}