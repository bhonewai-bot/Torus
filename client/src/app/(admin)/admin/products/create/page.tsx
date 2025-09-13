import { ProductCreateForm } from "@/features/products/components/admin/form/ProductCreateForm";
import {CustomBreadcrumb} from "@/components/common/CustomBreadcrumb";
import { ProductForm } from "@/features/products/components/admin/form/ProductForm";

export default function ProductCreatePage() {
    return (
        <div className={"flex flex-col gap-6 pb-4"}>
            <div className={"flex flex-col gap-4"}>
                <CustomBreadcrumb item={"Create Product"} />
                <h1 className={"text-3xl font-medium"}>Create Product</h1>
            </div>
            <ProductForm mode="create" />
        </div>
    );
}