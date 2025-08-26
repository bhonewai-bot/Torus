import {NextFunction, Request, Response} from "express";
import path from "path";
import fs from "fs/promises";
import {createSuccessResponse} from "@utils/helpers";

export async function uploadProductImages(req: Request, res: Response, next: NextFunction) {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const imageData = files.map((file, index) => ({
            url: `${baseUrl}/uploads/products/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            isMain: index === 0
        }));

        res.status(201).json(createSuccessResponse(
            `${files.length} image(s) uploaded successfully`,
            { images: imageData }
        ))
    } catch (error) {
        next(error);
    }
}

export async function deleteProductImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).json({
                success: false,
                message: "Filename is required",
            });
        }

        const filePath = path.join(process.cwd(), "uploads", "products", filename);

        try {
            await fs.unlink(filePath);
            res.status(200).json({
                success: true,
                message: "Image deleted successfully",
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: "Image not found",
            });
        }
    } catch (error) {
        next(error);
    }
}