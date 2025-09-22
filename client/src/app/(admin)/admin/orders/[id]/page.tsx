"use client";

import { OrderHeader } from "@/features/orders/components/admin/details/OrderHeader";
import { useOrder } from "@/features/orders/hooks/useOrders";
import React from "react";
import {OrderItemCard} from "@/features/orders/components/admin/details/OrderItemCard";
import {OrderShippingAddresss} from "@/features/orders/components/admin/details/OrderShippingAddresss";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {OrderSummaryCard} from "@/features/orders/components/admin/details/OrderSummaryCard";

interface OrderDetailPageProps {
    params: {
        id: string;
    }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    const router = useRouter();
    const { id } = React.use(params) as { id: string };
    const { data: order, isLoading, error } = useOrder(id);
    console.log(order);

    const onPrint = () => {

    }

    const onEdit = () => {
        
    }

    console.log(order);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !order) {
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
            <OrderHeader order={order} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 space-y-6">
                    <OrderSummaryCard order={order} />
                    <OrderItemCard order={order} />
                    <OrderShippingAddresss order={order} />
                 </div>
            </div>
        </div>
    )
}