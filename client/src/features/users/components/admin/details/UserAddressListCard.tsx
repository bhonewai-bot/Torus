import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDetail } from "@/features/users/types/user.types";
import { Edit, Trash2 } from "lucide-react";

export interface UserAddressListCardProps {
    users: UserDetail;
}

export function UserAddressListCard({ users }: UserAddressListCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        Addresses
                    </CardTitle>
                    <Button size="sm" variant="outline">
                        Add Address
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-0">
                    {users.addresses.map((address, index) => (
                        <div
                            key={address.id}
                            className={`p-6 ${index !== users.addresses.length - 1 ? "border-b border-muted/30" : ""}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="text-[16px] font-medium">
                                            {address.firstName} {address.lastName}
                                        </h4>
                                        {address.isDefault && (
                                            <Badge className="bg-primary text-primary-foreground">
                                                Default
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="text-[15px] font-medium text-muted-foreground/80 space-y-1">
                                        <p>{address.addressLine1}</p>
                                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                                        <p>
                                        {address.city}, {address.state} {address.postalCode}
                                        </p>
                                        <p>{address.country}</p>
                                        {address.phone && <p>{address.phone}</p>}
                                    </div>
                                </div>

                                <div className="flex space-x-2 ml-4">
                                    <Button
                                        //onClick={() => onEdit(address.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        // onClick={() => onDelete(address.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}