import {Router} from "express";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {
    postgresIdPathSchema,
    updateOrderStatusSchema,
} from "@utils/validation";
import {getAllOrders, getOrderById, refundOrder, updateOrderStatus} from "@controllers/admin/order.controller";

const router = Router();

router.get('/', getAllOrders);
router.get('/:id', validateParams(postgresIdPathSchema), getOrderById);
router.put('/:id/status', validateParams(postgresIdPathSchema), validateBody(updateOrderStatusSchema), updateOrderStatus);
router.post('/:id/refund', validateParams(postgresIdPathSchema), refundOrder);

export default router;