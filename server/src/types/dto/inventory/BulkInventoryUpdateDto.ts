import {z} from "zod";
import {bulkInventoryUpdateSchema} from "@utils/validation";

export type BulkInventoryUpdateDto = z.infer<typeof bulkInventoryUpdateSchema>