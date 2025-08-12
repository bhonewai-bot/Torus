import {UserResponse} from "@src/types/UserResponse";
import prisma from "@config/prisma";
import {UpdateUserStatusDto} from "@src/types/dto/user/UpdateUserStatusDto";

export async function getAllUsers(page = 1, limit = 10): Promise<{
    data: UserResponse[];
    pagination: { total: number; page: number; limit: number; totalPage: number };
}> {
    const skip = (page - 1) * limit;

    const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                enabled: true,
                createdAt: true,
            }
        }),
        prisma.user.count(),
    ]);

    return {
        data: users,
        pagination: {
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit)
        }
    }
}

export async function getUserById(id: string): Promise<UserResponse | null> {
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

export async function updateUserStatus(id: string, data: UpdateUserStatusDto): Promise<UserResponse | null> {
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
}