import {UserRole, UserStatus, Prisma } from "@prisma/client";
import prisma from "@src/config/prisma";
import { ErrorFactory } from "@src/lib/errors";
import { calculatePagination } from "@src/utils/helpers";
import { buildUserWhereClause } from "@src/utils/user/user.helpers";
import { updateUserRoleDto, updateUserStatusDto } from "@src/utils/user/user.schema";
import { formatUserList, formatUserRole, formatUserStatus } from "@src/utils/user/user.transformer";
import { th } from "zod/v4/locales/index.cjs";

export interface GetAllUsersParams {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    sortBy?: "name" | "email" | "createdAt";
    sortOrder?: "asc" | "desc";
}

export async function getAllUsers(params: GetAllUsersParams = {}) {
    try {
        const {
            page = 1,
            limit = -1,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = params;

        const where = buildUserWhereClause(params);
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

/* export async function getUserById(id: string): Promise<UserTypes | null> {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            enabled: true,
            createdAt: true,
        }
    });

    return user ?? null;
}

export async function updateUserStatus(id: string, data: UpdateUserStatusDto): Promise<UserTypes | null> {
    const { enabled } = data;

    const user = await prisma.user.update({
        where: { id },
        data: { enabled },
        select: {
            id: true,
            name: true,
            email: true,
            enabled: true,
            createdAt: true,
        }
    });

    return user ?? null;
}

export async function getUserAnalytics() {
    const totalUsers = await prisma.user.count();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const newUserThisMonth = await prisma.user.count({
        where: { createdAt: { gte: startOfMonth } }
    });

    const newUserThisWeek = await prisma.user.count({
        where: { createdAt: { gte: startOfWeek } }
    });

    const activeUsers = await prisma.user.count({
        where: { enabled: true },
    });

    const inactiveUsers = totalUsers - activeUsers;

    return {
        totalUsers,
        newUserThisMonth,
        newUserThisWeek,
        activeUsers,
        inactiveUsers
    }
} */

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