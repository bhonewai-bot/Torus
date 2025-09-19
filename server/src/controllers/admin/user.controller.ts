import {Request, Response} from "express";
import * as userService from '@services/user.service';
import {createSuccessResponse} from "@utils/helpers";
import { asyncHandler } from "@src/middlewares/error.handlers";
import { updateUserRoleDto, updateUserStatusDto, userQuerySchema } from "@src/utils/user/user.schema";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const validatedQuery = userQuerySchema.parse(req.query);

    const result = await userService.getAllUsers(validatedQuery);

    res.status(200).json(createSuccessResponse(
        'Users fetched successfully',
        {
            users: result.users,
            pagination: result.pagination
        }
    ));
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateUserRole: updateUserRoleDto = res.locals.validatedData;

    const result = await userService.updateUserRole(id, updateUserRole);

    res.status(200).json(createSuccessResponse(
        'User role updated successfully',
        result,
    ));
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateUserStatus: updateUserStatusDto = res.locals.validatedData;

    const result = await userService.updateUserStatus(id, updateUserStatus);

    res.status(200).json(createSuccessResponse(
        'User Status updated successfully',
        result,
    ));
});

/* export async function getUserById(req: Request, res: Response, next: NextFunction) {
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
} */