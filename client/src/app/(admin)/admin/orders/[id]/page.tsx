"use client";

import { OrderHeader } from "@/features/orders/components/details/OrderHeader";
import { useOrder } from "@/features/orders/hooks/useOrders";
import React from "react";
import {OrderInfoCard} from "@/features/orders/components/details/OrderInfoCard";
import {CustomerInfoCard} from "@/features/orders/components/details/CustomerInfoCard";
import {OrderItemCard} from "@/features/orders/components/details/OrderItemCard";
import {AddressCard} from "@/features/orders/components/details/AddressCard";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {OrderSummaryCard} from "@/features/orders/components/details/OrderSummaryCard";

interface OrderDetailPageProps {
    params: {
        id: string;
    }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    const router = useRouter();
    const { id } = React.use(params);
    const { data: order, isLoading, error } = useOrder(id);
    console.log(order);

    const onBack = () => {

    }

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
        <div className="space-y-6 pb-4">
            {/* Header */}
            <OrderHeader order={order} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Information */}
                <OrderInfoCard order={order} />

                {/* Customer Information */}
                <CustomerInfoCard order={order} />
            </div>

            {/* Order Items */}
            <OrderItemCard order={order} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Address */}
                <AddressCard order={order} />

                {/* Order Summary */}
                <OrderSummaryCard order={order} />
            </div>
        </div>
    )
}