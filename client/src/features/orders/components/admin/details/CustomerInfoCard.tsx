import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderDetail } from "@/features/orders/types/order.types";
import { Mail, Phone, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/lib/utils/display.utils";

interface CustomerInfoCardProps {
    order: OrderDetail;
}

export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
    const userInitials = getUserInitials(order.user.name);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Customer Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p>{order.user.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm">{order.user.email}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm">+66-800-932-347</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}