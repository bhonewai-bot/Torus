import {Router} from "express";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {getAllUsers, updateUserRole, updateUserStatus} from "@controllers/admin/user.controller";
import { updateUserRoleSchema, updateUserStatusSchema, userQuerySchema } from "@src/utils/user/user.schema";
import { postgresIdPathSchema } from "@src/utils/validation";

const router = Router();

router.get('/', validateQuery(userQuerySchema), getAllUsers);
router.patch('/:id/role', validateParams(postgresIdPathSchema), validateBody(updateUserRoleSchema), updateUserRole);
router.patch('/:id/status', validateParams(postgresIdPathSchema), validateBody(updateUserStatusSchema), updateUserStatus);
/* router.get('/:id', validateParams(postgresIdPathSchema), getUserById);
router.put('/:id/status', validateParams(postgresIdPathSchema), validateBody(updateUserStatusSchema), updateUserStatus);
router.get('/analytics/users', getUserAnalytics); */

export default router;