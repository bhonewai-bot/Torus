import {Prisma } from "@prisma/client";
import prisma from "@src/config/prisma";
import { ErrorFactory } from "@src/lib/errors";
import { UserFilter } from "@src/types/user.types";
import { calculatePagination } from "@src/utils/helpers";
import { buildUserWhereClause } from "@src/utils/user/user.helpers";
import { userDetailInclude } from "@src/utils/user/user.include";
import { updateUserRoleDto, updateUserStatusDto } from "@src/utils/user/user.schema";
import { formatUserDetail, formatUserList, formatUserRole, formatUserStatus } from "@src/utils/user/user.transformer";

export async function getUsers(filters: UserFilter = {}) {
    try {
        const {
            page = 1,
            limit = -1,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = filters;

        const where = buildUserWhereClause(filters);
        const skip = (page - 1) * limit;

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip,
                take: limit
            }),
            prisma.user.count({
                where
            })
        ]);

        const formattedUsers = users.map(formatUserList);
        const pagination = calculatePagination(total, page, limit);

        return {
            users: formattedUsers,
            pagination
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw ErrorFactory.fromPrismaError(error);
        }
        throw ErrorFactory.fromUnknownError(error);
    }
}

export async function getUser(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: userDetailInclude
        });

        if (!user) return null;

        return formatUserDetail(user);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw ErrorFactory.fromPrismaError(error, undefined, {
                operation: "getUser",
                userId: id
            });
        }
        throw ErrorFactory.fromUnknownError(error);
    }
}

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