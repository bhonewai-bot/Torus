import { UserDetail } from "@/features/users/types/user.types";
import { getUserRoleBadge, getUserStatusBadge } from "../UserBadge";
import { Ban, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserHeaderProps {
    user: UserDetail;
}

export function UserHeader({ user }: UserHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex justify-center items-center gap-4">
                    <h1 className="text-3xl font-medium">
                        {user.name}
                    </h1>
                    {getUserRoleBadge(user.role)}
                    {getUserStatusBadge(user.status)}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                </Button>
                <Button variant="outline" size="sm" className="text-red-500">
                    <Ban className="w-4 h-4 mr-2" />
                    Ban User
                </Button>
            </div>
        </div>
    )
}