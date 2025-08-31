import {OrderStatus} from "@prisma/client";

interface paramsProps {
    status?: OrderStatus;
    userId?: string;
    search?: string;
}

export function buildOrderWithWhereClause(params: paramsProps) {
    const { status, userId, search } = params;

    const where: any = {};

    if (status) {
        where.status = status;
    }

    if (userId) {
        where.userId = userId;
    }

    if (search) {
        where.OR = [
            { id: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
        ]
    }

    return where;
}