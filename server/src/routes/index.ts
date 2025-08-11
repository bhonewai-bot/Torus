import {Router} from "express";
import adminRoutes from "@routes/adminRoutes";

const router = Router();

router.use('/api/admin', adminRoutes);

export default router;