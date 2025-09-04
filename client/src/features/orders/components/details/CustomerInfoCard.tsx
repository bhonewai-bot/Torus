import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {OrderDetail} from "@/features/orders/types/order.types";
import {Copy, Mail, User} from "lucide-react";
import {Button} from "@/components/ui/button";

interface CustomerInfoCardProps {
    order: OrderDetail;
}

export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
    return (
        <Card className={"shadow-none"}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-700">
                        {/*<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                            {userInitials}
                        </AvatarFallback>*/}
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {order.user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.user.email}
                        </p>
                    </div>
                </div>

                <div className="space-y-3 pt-4">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                        <Mail className="h-4 w-4" />
                        Send Email
                    </Button>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                        <Copy className="h-4 w-4" />
                        Copy Customer ID
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}