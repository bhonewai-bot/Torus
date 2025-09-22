import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UserDetail } from "@/features/users/types/user.types";
import { getUserInitials } from "@/lib/utils/display.utils";
import { formatDate, formatOrderDate } from "@/lib/utils/format.utils";
import { Calendar, Mail, Phone } from "lucide-react";
import { useState } from "react";

interface UserSummaryCardProps {
    user: UserDetail;
}

export function UserSummaryCard({ user }: UserSummaryCardProps) {
    const [imageError, setImageError] = useState(false);
    
    console.log("SRC:", user.avatar);
    return (
        <Card className="mt-8">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full border-2 border-secondary overflow-hidden bg-muted flex items-center justify-center">
                            {user.avatar && !imageError ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                    {getUserInitials(user.name)}
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold">{user.name}</h2>
                            <p className="text-[15px] font-medium text-muted-foreground/80">ID: 6880f9985ef93a8fbeddefe8</p>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 ml-20 p-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-[15px] font-medium text-muted-foreground/80">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className="flex items-center space-x-2 text-[15px] font-medium text-muted-foreground/80">
                                    <Phone className="w-4 h-4" />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-[15px] font-medium text-muted-foreground/80">
                                <Calendar className="w-4 h-4" />
                                <div className="text-[15px]">
                                    <p>Account Created</p>
                                    <p className="opacity-75">{formatOrderDate(user.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}