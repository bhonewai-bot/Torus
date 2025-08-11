import {Request, Response, NextFunction} from "express";
import * as inventoryService from '@services/inventoryService';
import {UpdateInventoryDto} from "@src/types/dto/inventory/UpdateInventoryDto";
import {BulkInventoryUpdateDto} from "@src/types/dto/inventory/BulkInventoryUpdateDto";
import { createSuccessResponse } from '@utils/helpers';

export async function getAllInventory(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await inventoryService.getAllInventory();

        res.status(200).json(createSuccessResponse(
            'Inventory fetched successfully',
            result
        ));
    } catch (error) {
        next(error);
    }
}

export async function updateInventory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const updateInventoryDto: UpdateInventoryDto = res.locals.validatedData;

        const result = await inventoryService.updateInventory(id, updateInventoryDto);

        res.status(200).json(createSuccessResponse(
            'Inventory updated successfully',
            result
        ));
    } catch (error) {
        next(error);
    }
}

export async function getLowStockInventory(req: Request, res: Response, next: NextFunction) {
    try {
        const threshold = parseInt(req.query.threshold as string) || 5;

        const result = await inventoryService.getLowStockInventory(threshold);

        res.status(200).json(createSuccessResponse(
            'Low stock inventory fetched successfully',
            result
        ));
    } catch (error) {
        next(error);
    }
}

export async function bulkUpdateInventory(req: Request, res: Response, next: NextFunction) {
    try {
        const bulkInventoryUpdateDto: BulkInventoryUpdateDto = res.locals.validatedData;

        const result = await inventoryService.bulkUpdateInventory(bulkInventoryUpdateDto);

        res.status(200).json(createSuccessResponse(
            'Bulk inventory update successfully',
            result
        ));
    } catch (error) {
        next(error);
    }
}