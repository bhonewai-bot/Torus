import {NextFunction, Request, Response} from "express";
import * as orderService from '@services/order.service';
import {createSuccessResponse} from "@utils/helpers";
import {notFoundError} from "@middlewares/error.handlers";
import {orderQuerySchema} from "@utils/order/order.schema";
import {UpdateOrderDto} from "@src/types/dto/order.dto";

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

export async function updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const updateOrderDto: UpdateOrderDto = res.locals.validatedData;

        const result = await orderService.updateOrder(id, updateOrderDto);

        res.status(200).json(createSuccessResponse(
            "Order updated successfully",
            result
        ))
    } catch (error) {
        next(error);
    }
}