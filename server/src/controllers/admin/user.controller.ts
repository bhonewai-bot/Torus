import {NextFunction, Request, Response} from "express";
import * as userService from '@services/user.service';
import {calculatePagination, createSuccessResponse} from "@utils/helpers";
import {UpdateUserStatusDto} from "@src/types/dto/user/UpdateUserStatusDto";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.params.page as string) || 1;
        const limit = parseInt(req.params.limit as string) || 10;

        const result = await userService.getAllUsers(page, limit);
        const pagination = calculatePagination(result.pagination.total, page, limit);

        res.status(200).json(createSuccessResponse(
            'Users fetched successfully',
            result.data,
            pagination
        ));
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await userService.getUserById(id);

        res.status(200).json(createSuccessResponse(
            'User fetched successfully',
            result,
        ));
    } catch (error) {
        next(error);
    }
}

export async function updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const updateUserStatusDto: UpdateUserStatusDto = res.locals.validatedData;

        const result = await userService.updateUserStatus(id, updateUserStatusDto);

        res.status(200).json(createSuccessResponse(
            'User updated successfully',
            result,
        ));
    } catch (error) {
        next(error);
    }
}

export async function getUserAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await userService.getUserAnalytics();

        res.status(200).json(createSuccessResponse(
            'User analytics fetched successfully',
            result,
        ));
    } catch (error) {
        next(error);
    }
}