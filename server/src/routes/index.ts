import {Router} from "express";
import adminRoutes from "@routes/admin.routes";

const router = Router();

router.use('/api/admin', adminRoutes);

export default router;