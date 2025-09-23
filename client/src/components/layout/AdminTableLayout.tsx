import { ReactNode } from "react";
import { CustomBreadcrumb } from "../common/CustomBreadcrumb";
import { Button } from "../ui/button";

interface AdminTableLayoutProps {
    title: string;
    breadcrumbItem: string;
    isLoading?: boolean;
    error?: Error | null;
    onRetry?: () => void;
    children: ReactNode;
    headerActions?: ReactNode;
}

export function AdminTableLayout({
    title,
    breadcrumbItem,
    isLoading,
    error,
    onRetry,
    children,
    headerActions
}: AdminTableLayoutProps) {
    if (isLoading) {
        return (
            <main className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <CustomBreadcrumb item={breadcrumbItem} />
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-medium">{title}</h1>
                        {headerActions}
                    </div>
                </div>
                    <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <CustomBreadcrumb item={breadcrumbItem} />
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-medium">{title}</h1>
                        {headerActions}
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading {title.toLowerCase()}</p>
                        {onRetry && (
                        <Button onClick={onRetry} variant="outline">
                            Try Again
                        </Button>
                        )}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col gap-6 mb-6">
            <div className="flex flex-col gap-4">
                <CustomBreadcrumb item={breadcrumbItem} />
                <div className="flex justify-between">
                    <h1 className="text-3xl font-medium">{title}</h1>
                    {headerActions}
                </div>
            </div>

            {children}
        </main>
    );
}