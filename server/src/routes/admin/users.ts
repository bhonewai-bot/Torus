import {Router} from "express";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {
    paginationQuerySchema,
    postgresIdPathSchema,
    updateUserStatusSchema
} from "@utils/validation";
import {getAllUsers, getUserAnalytics, getUserById, updateUserStatus} from "@controllers/admin/userController";

const router = Router();

router.get('/', validateQuery(paginationQuerySchema), getAllUsers);
router.get('/:id', validateParams(postgresIdPathSchema), getUserById);
router.put('/:id/status', validateParams(postgresIdPathSchema), validateBody(updateUserStatusSchema), updateUserStatus);
router.get('/analytics/users', getUserAnalytics);

export default router;