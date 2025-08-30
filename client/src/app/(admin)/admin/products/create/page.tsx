import { ProductCreateForm } from "@/features/products/components/admin/form/ProductCreateForm";
import {ProductBreadcrumb} from "@/features/products/components/admin/ProductBreadcrumb";

export default function ProductCreatePage() {
    return (
        <div className={"flex flex-col gap-6 pb-4"}>
            <div className={"flex flex-col gap-4"}>
                <ProductBreadcrumb item={"Create Product"} />
                <h1 className={"text-3xl font-medium"}>Create Product</h1>
            </div>
            <ProductCreateForm />
        </div>
    );
}