import {NextFunction, Request, Response} from "express";
import * as orderService from '@services/order.service';
import {createSuccessResponse} from "@utils/helpers";
import {orderQuerySchema, updateOrderStatusDto} from "@utils/order/order.schema";
import { asyncHandler } from "@src/middlewares/error.handlers";
import { ErrorFactory } from "@src/lib/errors";

export const getAllOrders = asyncHandler(async(req: Request, res: Response) => {

    const validatedQuery = orderQuerySchema.parse(req.query);

    const result = await orderService.getAllOrders(validatedQuery);

    res.status(200).json(createSuccessResponse(
        "Orders fetched successfully",
        {
            orders: result.orders,
            pagination: result.pagination,
        }
    ))
})

export const getOrderById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw ErrorFactory.badRequest("Order ID is required", req);
    }

    const order = await orderService.getOrderById(id);

    if (!order) {
        throw ErrorFactory.notFound("Order", req);
    }

    res.status(200).json(createSuccessResponse(
        "Order retrieved successfully",
        order
    ));
})

export const updateOrderStatus = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const orderStatus: updateOrderStatusDto = res.locals.validatedData;

    const result = await orderService.updateOrderStatus(id, orderStatus);

    res.status(200).json(createSuccessResponse(
        "Order status updated successfully",
        result
    ))
}) 