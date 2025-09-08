import {Router} from "express";
import {createCategory, deleteCategory, getAllCategories, updateCategory} from "@controllers/admin/category.controller";
import {validateBody, validateParams} from "@middlewares/validation";
import {createCategorySchema, postgresIdPathSchema} from "@utils/validation";

const route = Router();

route.get("/", getAllCategories);
route.post("/", validateBody(createCategorySchema), createCategory);
route.put("/:id",validateParams(postgresIdPathSchema), updateCategory );
route.delete("/:id", validateParams(postgresIdPathSchema), deleteCategory);

export default route;