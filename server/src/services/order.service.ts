import prisma from "@config/prisma";
import {Prisma} from "@prisma/client";
import {orderDetailInclude, orderListInclude} from "@utils/order/order.include";
import {buildOrderWithWhereClause} from "@utils/order/order.helpers";
import {formatOrderDetail, formatOrderList} from "@utils/order/order.transformer";
import {OrderDetail, OrderFilter, OrderList} from "@src/types/order.types";
import {updateOrderStatusDto} from "@utils/order/order.schema";
import { ErrorFactory } from "@src/lib/errors";
import { createService } from "./service.factory";

const orderService = createService<OrderList, OrderDetail, OrderFilter>({
    model: prisma.order,
    listInclude: orderListInclude,
    detailInclude: orderDetailInclude,
    listTransformer: formatOrderList,
    detailTransformer: formatOrderDetail,
    whereBuilder: buildOrderWithWhereClause,
    defaultSortBy: "createdAt",
    smartPaginationThreshold: 100,
    modelName: "Order",
    listPropertyName: "orders",
});

export const getOrders = orderService.getMany;
export const getOrder = orderService.getById;

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