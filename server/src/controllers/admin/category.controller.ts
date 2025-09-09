import {Request, Response} from "express";
import * as categoryService from "@services/category.service";
import {createSuccessResponse} from "@utils/helpers";
import {createCategoryDto} from "@utils/category/category.schema";
import { asyncHandler } from "@src/middlewares/error.handlers";
import { ErrorFactory } from "@src/lib/errors";

export const getAllCategories = asyncHandler(async(req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();

    res.status(200).json(createSuccessResponse(
        "Categories retrieved successfully",
        result,
    ));
});

export const createCategory = asyncHandler(async(req: Request, res: Response) => {
    const newCategory: createCategoryDto = res.locals.validatedData;
    const result = await categoryService.createCategory(newCategory);

    res.status(201).json(createSuccessResponse(
        "Category created successfully",
        result,
    ));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title } = req.body;

    if (!id) {
        throw ErrorFactory.badRequest("Category ID is required", req);
    }

    const result = await categoryService.updateCategory(id, { title });

    if (!result) {
        throw ErrorFactory.notFound("Category", req);
    }

    res.status(200).json(createSuccessResponse(
        "Category updated successfully",
        result
    ));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw ErrorFactory.badRequest("Category ID is required", req);
    }

    const result = await categoryService.deleteCategory(id);

    if (!result) {
        throw ErrorFactory.notFound("Category", req);
    }

    res.status(200).json(createSuccessResponse(
        "Category deleted successfully",
        result
    ));
});