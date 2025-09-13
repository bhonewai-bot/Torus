import {Request, Response} from "express";
import * as productService from '@services/product.service';
import { createSuccessResponse } from '@utils/helpers';
import { asyncHandler } from '@middlewares/error.handlers';
import {createProductDto, productQuerySchema, updateProductDto} from "@utils/product/product.schema";
import { ErrorFactory } from "@src/lib/errors";

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const validatedQuery = productQuerySchema.parse(req.query);

    const result = await productService.getAllProducts(validatedQuery);

    res.status(200).json(createSuccessResponse(
        'Products fetched successfully', 
        {
            products: result.products,
            pagination: result.pagination,
        }
    ));
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw ErrorFactory.badRequest("Product ID is required", req);
    }

    const product = await productService.getProductById(id);

    if (!product) {
        throw ErrorFactory.notFound('Product', req);
    }

    res.status(200).json(createSuccessResponse(
        'Product retrieved successfully',
        product
    ));
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const newProduct: createProductDto = res.locals.validatedData;

    const result = await productService.createProduct(newProduct);

    res.status(201).json(createSuccessResponse(
        "Product created successfully",
        result
    ));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedProduct: updateProductDto = res.locals.validatedData;

    if (!id) {
        throw ErrorFactory.badRequest("Product ID is required", req);
    }

    const result = await productService.updateProduct(id, updatedProduct);

    if (!result) {
        throw ErrorFactory.notFound("Product", req);
    }

    res.status(200).json(createSuccessResponse(
        "Product updated successfully",
        result,
    ));
});

export const deleteProduct = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw ErrorFactory.badRequest("Product ID is required", req);
    }

    const result = await productService.deleteProduct(id);

    if (!result) {
        throw ErrorFactory.notFound("Product", req);
    }

    res.status(200).json(createSuccessResponse(
        "Product deleted successfully",
    ));
});

export const bulkDeleteProducts = asyncHandler(async(req: Request, res: Response) => {
    const { ids } = res.locals.validatedData;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw ErrorFactory.badRequest("At least one product ID is required", req);
    }

    const deletedCount = await productService.bulkDeleteProducts(ids);

    if (!deletedCount) {
        throw ErrorFactory.notFound("Products", req);
    }

    res.status(200).json(createSuccessResponse(
        `${deletedCount} product(s) deleted successfully`,
        { deletedCount }
    ));
});