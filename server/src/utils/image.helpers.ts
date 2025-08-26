import path from "path";
import fs from "fs/promises";

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
 * Delete image file from local storage
 */
export async function deleteImageFile(filename: string): Promise<boolean> {
    try {
        const filePath = path.join(process.cwd(), "uploads", "products", filename);
        await fs.unlink(filePath);
        return true;
    } catch {
        return false;
    }
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