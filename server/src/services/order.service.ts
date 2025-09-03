import prisma from "@config/prisma";
import {OrderStatus, PaymentStatus} from "@prisma/client";
import {orderDetailInclude, orderListInclude} from "@utils/order/order.include";
import {calculatePagination} from "@utils/helpers";
import {buildOrderWithWhereClause} from "@utils/order/order.helpers";
import {UpdateOrderDto} from "@src/types/dto/order.dto";
import {formatOrderDetail, formatOrderList} from "@utils/order/order.transformer";
import {OrderDetail} from "@src/types/order.types";

export interface GetAllOrdersParams {
    page?: number;
    limit?: number;
    paymentStatus?: PaymentStatus;
    orderStatus?: OrderStatus;
    userId?: string;
    search?: string;
    sortBy?: "total" | "subtotal" | "paymentStatus" | "orderStatus" | "createdAt" | "updatedAt";
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

    const formattedOrders = orders.map(formatOrderList);
    const pagination = calculatePagination(total, page, limit);

    return {
        orders: formattedOrders,
        pagination
    }
}

export async function getOrderById(id: string) {
    const order = await prisma.order.findUnique({
        where: { id },
        include: orderDetailInclude,
    });

    if (!order) return null;

    return formatOrderDetail(order);
}

export async function updateOrder(id: string, data: UpdateOrderDto): Promise<OrderDetail | null> {
    const order = await prisma.order.update({
        where: { id },
        data,
        include: orderListInclude,
    });

    return formatOrderDetail(order);
}