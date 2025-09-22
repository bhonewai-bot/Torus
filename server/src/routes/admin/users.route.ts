import {Router} from "express";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {getAllUsers, getUser, updateUserRole, updateUserStatus} from "@controllers/admin/user.controller";
import { updateUserRoleSchema, updateUserStatusSchema, userQuerySchema } from "@src/utils/user/user.schema";
import { postgresIdPathSchema } from "@src/utils/validation";

const router = Router();

router.get('/', validateQuery(userQuerySchema), getAllUsers);
router.get('/:id', validateParams(postgresIdPathSchema), getUser);
router.patch('/:id/role', validateParams(postgresIdPathSchema), validateBody(updateUserRoleSchema), updateUserRole);
router.patch('/:id/status', validateParams(postgresIdPathSchema), validateBody(updateUserStatusSchema), updateUserStatus);

export default router;