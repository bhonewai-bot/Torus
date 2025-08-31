import prisma from "@config/prisma";
import {OrderStatus} from "@prisma/client";
import {orderListInclude} from "@utils/order/order.include";
import {formatOrder} from "@utils/order/order.transformer";
import {calculatePagination} from "@utils/helpers";
import {buildOrderWithWhereClause} from "@utils/order/order.helpers";
import {UpdateOrderDto} from "@src/types/dto/order.dto";
import {Order} from "@src/types/order.types";

export interface GetAllOrdersParams {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    userId?: string;
    search?: string;
    sortBy?: "total" | "subtotal" | "status" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
}

export async function getAllOrders(params: GetAllOrdersParams = {}) {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;
    const where = buildOrderWithWhereClause(params);

    const [orders, total] = await prisma.$transaction([
        prisma.order.findMany({
            where,
            include: orderListInclude,
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip,
            take: limit,
        }),
        prisma.order.count({ where }),
    ]);

    const formattedOrders = orders.map(formatOrder);
    const pagination = calculatePagination(total, page, limit);

    return {
        orders: formattedOrders,
        pagination
    }
}

export async function getOrderById(id: string) {
    const order = await prisma.order.findUnique({
        where: { id },
        include: orderListInclude,
    });

    if (!order) return null;

    return formatOrder(order);
}

export async function updateOrder(id: string, data: UpdateOrderDto): Promise<Order | null> {
    const order = await prisma.order.update({
        where: { id },
        data,
        include: orderListInclude,
    });

    return formatOrder(order);
}

/*

export async function updateOrderStatus(id: string, data: UpdateOrderStatusDto): Promise<OrderTypes | null> {
    const { status } = data;

    const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    });

    return formatOrder(order) ?? null;
}

export async function refundOrder(id: string): Promise<OrderTypes | null> {
    const order = await prisma.order.update({
        where: { id },
        data: {
            status: 'REFUNDED',
            refunded: true,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    });

    return formatOrder(order) ?? null;
}*/
