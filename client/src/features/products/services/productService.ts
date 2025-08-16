import api from "@/lib/api/client";
import {Products} from "@/features/products/components/admin/table/columns";

export async function getAllProducts(): Promise<Products[]> {
    const res = await api.get("/admin/products");
    return res.data.data;
}