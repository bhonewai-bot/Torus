import {Request, Response, NextFunction} from "express";
import * as productService from '@services/product.service';
import { createSuccessResponse } from '@utils/helpers';
import { notFoundError } from '@middlewares/error.handlers';
import {createProductDto, productQuerySchema, updateProductDto} from "@utils/product/product.schema";

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const validatedQuery = productQuerySchema.parse(req.query);

        const result = await productService.getAllProducts(validatedQuery);

        res.status(200).json(createSuccessResponse(
            'Products fetched successfully', {
                products: result.products,
                pagination: result.pagination,
            }
        ));
    } catch (error) {
        next(error)
    }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await productService.getProductById(id);

        if (!result) {
            throw notFoundError('Product');
        }

        res.status(200).json(createSuccessResponse(
            'Product retrieved successfully',
            result
        ));
    } catch (error) {
        next(error);
    }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const newProduct: createProductDto = res.locals.validatedData;

        const result = await productService.createProduct(newProduct);

        res.status(201).json(createSuccessResponse(
            "Product created successfully",
            result
        ));
    } catch (error) {
        next(error);
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const updatedProduct: updateProductDto = res.locals.validatedData;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const result = await productService.updateProduct(id, updatedProduct);

        res.status(200).json(createSuccessResponse(
            "Product updated successfully",
            result,
        ));
    } catch (error) {
        if (error instanceof Error && error.message === "Product not found") {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        next(error);
    }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await productService.deleteProduct(id);

        if (!result) {
            throw notFoundError("Product");
        }

        res.status(204).json(createSuccessResponse(
            "Product deleted successfully",
        ))
    } catch (error) {
        next(error);
    }
}