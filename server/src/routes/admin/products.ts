import {Router} from "express";
import { getAllProducts } from "@controllers/admin/productController";

const router = Router();

router.get('/', getAllProducts);

export default router;