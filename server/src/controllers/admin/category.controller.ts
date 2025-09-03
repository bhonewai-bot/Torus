import {NextFunction, Request, Response} from "express";
import * as categoryService from "@services/category.service";
import {createSuccessResponse} from "@utils/helpers";
import {notFoundError} from "@middlewares/error.handlers";
import {CreateCategoryDto} from "@src/types/dto/category/CreateCategoryDto";
import {createCategoryDto} from "@utils/category/category.schema";

export async function getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await categoryService.getAllCategories();

        res.status(200).json(createSuccessResponse(
            "Categories retrieved successfully",
            result,
        ));
    } catch (error) {
        next(error);
    }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const newCategory: createCategoryDto = res.locals.validatedData;
        const result = await categoryService.createCategory(newCategory);

        res.status(201).json(createSuccessResponse(
            "Category created successfully",
            result,
        ));
    } catch (error) {
        next(error);
    }
}