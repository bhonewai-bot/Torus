import {Router} from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "@controllers/admin/productController";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {
    postgresIdPathSchema,
} from "@utils/validation";
import {createProductSchema, productQuerySchema, updateProductSchema} from "@utils/product/product.validation";

const router = Router();

router.get('/', validateQuery(productQuerySchema), getAllProducts);
router.get('/:id', validateParams(postgresIdPathSchema), getProductById);
router.post('/', validateBody(createProductSchema), createProduct);
router.put('/:id', validateParams(postgresIdPathSchema), validateBody(updateProductSchema), updateProduct);
router.delete('/:id', validateParams(postgresIdPathSchema), deleteProduct);

export default router;