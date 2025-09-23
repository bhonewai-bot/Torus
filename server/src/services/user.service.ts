import {Prisma } from "@prisma/client";
import prisma from "@src/config/prisma";
import { ErrorFactory } from "@src/lib/errors";
import { UserDetail, UserFilter, UserList } from "@src/types/user.types";
import { calculatePagination } from "@src/utils/helpers";
import { buildUserWhereClause } from "@src/utils/user/user.helpers";
import { userDetailInclude } from "@src/utils/user/user.include";
import { updateUserRoleDto, updateUserStatusDto } from "@src/utils/user/user.schema";
import { formatUserDetail, formatUserList, formatUserRole, formatUserStatus } from "@src/utils/user/user.transformer";
import { createService } from "./service.factory";

const userService = createService<UserList, UserDetail, UserFilter>({
    model: prisma.user,
    listInclude: undefined,
    detailInclude: userDetailInclude,
    listTransformer: formatUserList,
    detailTransformer: formatUserDetail,
    whereBuilder: buildUserWhereClause,
    defaultSortBy: "createdAt",
    smartPaginationThreshold: 100,
    modelName: "User",
    listPropertyName: "users",
});

export const getUsers = userService.getMany;
export const getUser = userService.getById;

export async function updateUserRole(id: string, data: updateUserRoleDto) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                role: true,
                updatedAt: true
            }
        });

        if (!updatedUser) {
            throw ErrorFactory.createError(
                "Failed to update user role",
                500,
                "USER_ROLE_UPDATE_FAILED",
            );
        }

        return formatUserRole(updatedUser);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw ErrorFactory.fromPrismaError(error, undefined, {
                operation: "updateUserRole",
                userId: id,
                updateData: data,
            })
        }
    }
}

export async function updateUserStatus(id: string, data: updateUserStatusDto) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                status: true,
                updatedAt: true
            }
        });

        if (!updatedUser) {
            throw ErrorFactory.createError(
                "Failed to update user status",
                500,
                "USER_STATUS_UPDATE_FAILED",
            );
        }

        return formatUserStatus(updatedUser);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw ErrorFactory.fromPrismaError(error, undefined, {
                operation: "updateUserSTATUS",
                userId: id,
                updateData: data,
            })
        }
    }
}