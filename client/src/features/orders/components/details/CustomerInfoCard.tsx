import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderDetail } from "@/features/orders/types/order.types";
import { Mail, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "../../utils/order.ui.utils";

interface CustomerInfoCardProps {
    order: OrderDetail;
}

export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
    const userInitials = getUserInitials(order.user.name);
    
    return (
        <Card className={"gap-3"}>
            <CardHeader>
                <CardTitle>
                    Customer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-start text-left space-y-4">
                    <Avatar className="h-14 w-14 border-4 border-white dark:border-gray-800 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-lg">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {order.user.name}
                        </h3>
                        <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                            <Mail className={"h-5 w-5"} />
                            {order.user.email}
                        </p>
                    </div>
                </div>

                {/*<div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="w-full gap-2 h-11 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20">
                        <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Send Email
                    </Button>
                    <Button variant="outline" className="w-full gap-2 h-11 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20">
                        <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                        View Profile
                    </Button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Customer ID: #{order.user.id || 'N/A'}
                    </div>
                </div>*/}
            </CardContent>
        </Card>
    )
}