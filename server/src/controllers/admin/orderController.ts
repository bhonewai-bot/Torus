import {NextFunction, Request, Response} from "express";
import * as orderService from '@services/orderService';
import {calculatePagination, createSuccessResponse} from "@utils/helpers";
import {UpdateOrderStatusDto} from "@src/types/dto/order/UpdateOrderStatusDto";

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await orderService.getAllOrders(page, limit);
        const pagination = calculatePagination(result.pagination.total, page, limit);

        res.status(200).json(createSuccessResponse(
            'Orders fetched successfully',
            result.data,
            pagination,
        ));
    } catch (error) {
        next(error);
    }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await orderService.getOrderById(id);

        res.status(200).json(createSuccessResponse(
            'Order fetched successfully',
            result,
        ));
    } catch (error) {
        next(error);
    }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const updateOrderStatusDto: UpdateOrderStatusDto = res.locals.validatedData;

        const result = await orderService.updateOrderStatus(id, updateOrderStatusDto);

        res.status(200).json(createSuccessResponse(
            'Order status updated successfully',
            result,
        ));
    } catch (error) {
        next(error);
    }
}

export async function refundOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await orderService.refundOrder(id);

        res.status(200).json(createSuccessResponse(
            'Order refunded successfully',
            result,
        ));
    } catch (error) {
        next(error);
    }
}