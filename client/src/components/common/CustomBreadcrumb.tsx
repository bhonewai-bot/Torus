import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
    BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {ReactNode} from "react";

export function CustomBreadcrumb({item}: { item: ReactNode }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href={"/admin/overview"}>Overview</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{item}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}