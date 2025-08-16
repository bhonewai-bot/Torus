import {DataTable} from "@/features/admin/components/products/table/data-table";
import {columns, Products} from "@/features/admin/components/products/table/columns";

const getData = async (): Promise<Products[]> => {
    return [
        {
            name: "Temu",
            sku: "PD-1",
            price: 69.00,
            categories: ["snack"],
            images: ["temu.jepg"],
            quantity: 21,
        }
    ];
}

export async function ProductTable() {
    const data = await getData();
    return (
        <DataTable columns={columns} data={data} />
    )
}