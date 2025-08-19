import {Request, Response, NextFunction} from "express";
import * as productService from '@services/productService';
import {CreateProductDto} from "@src/types/dto/product/CreateProductDto";
import {UpdateProductDto} from "@src/types/dto/product/UpdateProductDto";
import { createSuccessResponse, calculatePagination } from '@utils/helpers';
import { notFoundError } from '@middlewares/errorHandlers';

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const {
            page,
            limit,
            categoryId,
            brand,
            isActive,
            search,
            sortBy,
            sortOrder,
        } = req.query;

        const params = {
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(page as string) : undefined,
            categoryId: categoryId as string,
            brand: brand as string,
            isActive: isActive === "false" ? false : true,
            search: search as string,
            sortBy: sortBy as "title" | "price" | "createdAt" | "updatedAt",
            sortOrder: sortOrder as "asc" | "desc",
        }

        const result = await productService.getAllProducts(params);

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
        const createProductDto: CreateProductDto = res.locals.validatedData;
        const result = await productService.createProduct(createProductDto);

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
        const updateProductDto: UpdateProductDto = res.locals.validatedData;

        const result = await productService.updateProduct(id, updateProductDto);

        res.status(200).json(createSuccessResponse(
            "Product updated successfully",
            result,
        ));
    } catch (error) {
        next(error);
    }
}

/*
export async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const createProductDto: CreateProductDto = res.locals.validatedData;
        const result = await productService.createProduct(createProductDto);

        res.status(201).json(createSuccessResponse(
            'Product created successfully',
            result
        ));
    } catch (error) {
        next(error);
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

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const updateProductDto: UpdateProductDto = res.locals.validatedData;

        const result = await productService.updateProduct(id, updateProductDto);

        res.status(200).json(createSuccessResponse(
            'Product updated successfully',
            result
        ));
    } catch (error) {
        next(error);
    }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await productService.deleteProduct(id);

        if (!result) {
            throw notFoundError('Product');
        }

        res.status(200).json(createSuccessResponse(
            'Product deleted successfully',
            result
        ));
    } catch (error) {
        next(error);
    }
}

export async function addProductImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const { images } = res.locals.validatedData;

        const result = await productService.addProductImage(id, images);

        res.status(201).json(createSuccessResponse(
            'Images added successfully',
            result
        ));
    } catch (error) {
        next(error);
    }
}*/
