import {NextFunction, Request, Response} from "express";
import * as orderService from '@services/order.service';
import {createSuccessResponse} from "@utils/helpers";
import {notFoundError} from "@middlewares/error.handlers";
import {orderQuerySchema, updateOrderStatusDto} from "@utils/order/order.schema";

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const validatedQuery = orderQuerySchema.parse(req.query);

        const result = await orderService.getAllOrders(validatedQuery);

        res.status(200).json(createSuccessResponse(
            "Orders fetched successfully", {
                orders: result.orders,
                pagination: result.pagination,
            }
        ))
    } catch (error) {
        next(error);
    }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await orderService.getOrderById(id);

        if (!result) {
            throw notFoundError('Order');
        }

        res.status(200).json(createSuccessResponse(
            "Order retrieved successfully",
            result
        ));
    } catch (error) {
        next(error);
    }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const orderStatus: updateOrderStatusDto = res.locals.validatedData;

        const result = await orderService.updateOrderStatus(id, orderStatus);

        res.status(200).json(createSuccessResponse(
            "Order status updated successfully",
            result
        ))
    } catch (error) {
        next(error);
    }
}