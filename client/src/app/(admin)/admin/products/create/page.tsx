import {ProductBreadcrumb} from "@/features/products/components/admin/ProductBreadcrumb";
import {ProductForm} from "@/features/products/components/admin/ProductForm";

export default function CreatePage() {
    return (
        <main className={"flex flex-col gap-6"}>
            <div className={"flex flex-col gap-4"}>
                <ProductBreadcrumb item={"Create Product"} />
                <h1 className={"text-3xl font-medium"}>Create Product</h1>
            </div>
            <ProductForm />
        </main>
    );
}