import {NextFunction, Request, Response} from "express";
import * as categoryService from "services/categoryService";
import {createSuccessResponse} from "@utils/helpers";
import {notFoundError} from "@middlewares/errorHandlers";
import {CreateCategoryDto} from "@src/types/dto/category/CreateCategoryDto";

export async function getCategoriesForSelect(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await categoryService.getCategoriesForSelect();

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
        const createCategoryDto: CreateCategoryDto = res.locals.validatedData;
        const result = await categoryService.createCategory(createCategoryDto);

        res.status(201).json(createSuccessResponse(
            "Category created successfully",
            result,
        ));
    } catch (error) {
        next(error);
    }
}

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