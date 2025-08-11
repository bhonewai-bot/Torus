import {Router} from "express";
import {
    addProductImage,
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from "@controllers/admin/productController";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {
    createProductSchema,
    postgresIdPathSchema,
    paginationQuerySchema,
    updateProductSchema,
    addProductImagesSchema
} from "@utils/validation";

const router = Router();

router.get('/', validateQuery(paginationQuerySchema), getAllProducts);
router.post('/', validateBody(createProductSchema), createProduct);
router.get('/:id', validateParams(postgresIdPathSchema), getProductById);
router.put('/:id', validateParams(postgresIdPathSchema), validateBody(updateProductSchema), updateProduct);
router.delete('/:id', validateParams(postgresIdPathSchema), deleteProduct);
router.post('/:id/images', validateParams(postgresIdPathSchema), validateBody(addProductImagesSchema), addProductImage);

export default router;