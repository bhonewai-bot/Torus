import prisma from "@config/prisma";
import {Prisma} from "@prisma/client";
import {orderDetailInclude, orderListInclude} from "@utils/order/order.include";
import {calculatePagination} from "@utils/helpers";
import {buildOrderWithWhereClause} from "@utils/order/order.helpers";
import {formatOrderDetail, formatOrderList} from "@utils/order/order.transformer";
import {OrderDetail, OrderFilter} from "@src/types/order.types";
import {updateOrderStatusDto} from "@utils/order/order.schema";
import { ErrorFactory } from "@src/lib/errors";

export async function getOrders(filters: OrderFilter = {}) {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = filters;

        const where = buildOrderWithWhereClause(filters);

        if (limit === -1) {
            const orders = await prisma.order.findMany({
                where,
                include: orderListInclude,
                orderBy: {
                    [sortBy]: sortOrder
                }
            });

            const formattedOrders = orders.map(formatOrderList);
            const pagination = calculatePagination(orders.length, page, -1);

            return {
                orders: formattedOrders,
                pagination
            }
        }

        const skip = (page - 1) * limit;

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

        const formattedOrders = orders.map(formatOrderList);
        const pagination = calculatePagination(total, page, limit);

        return {
            orders: formattedOrders,
            pagination
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw ErrorFactory.fromPrismaError(error);
        }
        throw ErrorFactory.fromUnknownError(error);
    }
}

export async function getOrder(id: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: orderDetailInclude,
        });

        if (!order) return null;

        return formatOrderDetail(order);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw ErrorFactory.fromPrismaError(error, undefined, {
                operation: "getOrderById",
                orderId: id,
            });
        }
        throw ErrorFactory.fromUnknownError(error);
    }
}

export async function updateOrderStatus(id: string, data: updateOrderStatusDto): Promise<OrderDetail | null> {
    try {
        const updatedOrder = await prisma.order.update({
            where: { id },
            data,
            include: orderDetailInclude,
        });

        if (!updatedOrder) {
            throw ErrorFactory.createError(
                "Failed to update order statuses",
                500,
                "ORDER_UPDATE_FAILED",
            );
        }

        return formatOrderDetail(updatedOrder);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw ErrorFactory.fromPrismaError(error, undefined, {
                operation: "updateOrderStatuses",
                orderId: id,
                updateData: data,
            })
        }
    }

    return null;
}