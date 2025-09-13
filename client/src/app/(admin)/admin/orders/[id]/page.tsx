"use client";

import { OrderHeader } from "@/features/orders/components/details/OrderHeader";
import { useOrder } from "@/features/orders/hooks/useOrders";
import React from "react";
import {OrderInfoCard} from "@/features/orders/components/details/OrderInfoCard";
import {CustomerInfoCard} from "@/features/orders/components/details/CustomerInfoCard";
import {OrderItemCard} from "@/features/orders/components/details/OrderItemCard";
import {AddressInfoCard} from "@/features/orders/components/details/AddressInfoCard";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {OrderSummaryCard} from "@/features/orders/components/details/OrderSummaryCard";
import {OrderStatusCard} from "@/features/orders/components/details/OrderStatusCard";

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

            <div>
                {/* Order Information */}
                <OrderInfoCard order={order} />


            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <OrderItemCard order={order} />
                </div>

                <div className="space-y-6">
                    {/* Customer Information */}
                    <CustomerInfoCard order={order} />

                    {/* Address Information */}
                    <AddressInfoCard order={order} />

                    {/* Order Summary */}
                    <OrderSummaryCard order={order} />

                    {/* Order Status */}
                    <OrderStatusCard order={order} />
                </div>
            </div>
        </div>
    )
}