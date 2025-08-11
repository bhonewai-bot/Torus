import {Router} from "express";
import {
    getAllInventory,
    updateInventory,
    getLowStockInventory,
    bulkUpdateInventory
} from "@controllers/admin/inventoryController";
import {validateBody, validateParams} from "@middlewares/validation";
import {bulkInventoryUpdateSchema, postgresIdPathSchema, updateInventorySchema} from "@utils/validation";

const router = Router();

router.get('/', getAllInventory);
router.put('/:id', validateParams(postgresIdPathSchema), validateBody(updateInventorySchema), updateInventory);
router.get('/low-stock', getLowStockInventory);
router.post('/bulk-update', validateBody(bulkInventoryUpdateSchema), bulkUpdateInventory);

export default router;