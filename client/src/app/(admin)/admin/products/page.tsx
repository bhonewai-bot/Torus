import {ProductBreadcrumb} from "@/features/products/components/admin/ProductBreadcrumb";
import {ProductTable} from "@/features/products/components/admin/table/page";

export default function ProductsPage() {
    return (
        <main className={"flex flex-col gap-6"}>
            <div className={"flex flex-col gap-4"}>
                <ProductBreadcrumb />
                <h1 className={"text-3xl font-medium"}>Products</h1>
            </div>
            <ProductTable />

        </main>
    );
}