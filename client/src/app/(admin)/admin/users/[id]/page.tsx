"use client";

import { Button } from "@/components/ui/button";
import { UserAddressListCard } from "@/features/users/components/admin/details/UserAddressListCard";
import { UserHeader } from "@/features/users/components/admin/details/UserHeader";
import { UserOrderListCard } from "@/features/users/components/admin/details/UserOrderListCard";
import { UserSummaryCard } from "@/features/users/components/admin/details/UserSummaryCard";
import { useUser } from "@/features/users/hooks/useUsers";
import { useRouter } from "next/navigation";
import React from "react";

interface UserDetailPageProps {
    params: {
        id: string;
    }
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
    const router = useRouter();
    const { id } = React.use(params) as { id: string };
    const { data: user, isLoading, error } = useUser(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading product</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 pb-6">
            <UserHeader user={user} />

            <UserSummaryCard user={user} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <UserAddressListCard users={user} />
                    <UserOrderListCard user={user} />
                </div>
            </div>
        </div>
    );
}