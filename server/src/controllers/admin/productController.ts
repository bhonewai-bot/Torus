import {Request, Response, NextFunction} from "express";
import * as productService from '@services/productService';
import {CreateProductDto} from "@src/types/dto/CreateProductDto";
import {UpdateProductDto} from "@src/types/dto/UpdateProductDto";

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await productService.getAllProducts(page, limit);

        res.status(200).json({
            success: true,
            message: "operation completed successfully",
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const createProductDto: CreateProductDto = res.locals.validatedData;
        const result = await productService.createProduct(createProductDto);

        res.status(201).json({
            success: true,
            message: 'product created successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await productService.getProductById(id);

        if (!result) {
            res.status(404).json({
                success: false,
                message: "product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: 'product retrieved successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const updateProductDto: UpdateProductDto = res.locals.validatedData;

        const result = await productService.updateProduct(id, updateProductDto);

        res.status(200).json({
            success: true,
            message: 'product updated successfully',
            result,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await productService.deleteProduct(id);

        if (!result) {
            return res.status(404).json({
                success: 404,
                message: "product not found",
            });
        }

        res.status(200).json({
            success: 200,
            message: "product deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function addProductImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const { images } = res.locals.validatedData;

        const result = await productService.addProductImage(id, images);

        res.status(201).json({
            success: true,
            message: "images added successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}