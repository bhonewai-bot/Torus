"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { USER_STATUSES, UserList, UserRole, UserStatus } from "@/features/users/types/user.types";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, 
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ban, Edit, Eye, MoreHorizontal, Shield, Trash2 } from "lucide-react";
import { getUserRoleBadge, getUserStatusBadge } from "../UserBadge";
import { useUpdateUserRole, useUpdateUserStatus } from "@/features/users/hooks/useUsers";
import { formatUserDate } from "@/lib/utils/format.utils";
import { validateUserOperation } from "@/features/users/utils/user.validation";

type TableHeaderCellProps = {
    children: ReactNode;
};

export function TableHeaderCell({ children }: TableHeaderCellProps) {
    return (
        <div className="text-[15px] font-normal">
            {children}
        </div>
    );
}

function ProductCell({ user }: { user: any }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Product Image */}
      <div className="w-10 h-10 relative bg-gray-100 rounded-full flex items-center justify-center">
        {!user.avatar || imageError ? (
          <Image
            src={"/avatar.png"}
            alt="user"
            fill
            className="object-cover rounded-full"
            sizes="40px"
          />
        ) : (
          <Image
            src={user?.avatar}
            alt={user.name}
            fill
            className="object-cover rounded-full"
            sizes="40px"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <Link
        href={`/admin/users/${user.id}`}
        className="max-w-[300px] truncate font-normal text-primary dark:text-primary hover:underline"
      >
        {user.name}
      </Link>
    </div>
  );
}

export const columns: ColumnDef<UserList>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all products"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        id: "user",
        header: () => <TableHeaderCell>Customer</TableHeaderCell>,
        cell: ({ row }: { row: any }) => <ProductCell user={row.original} />,
    },
    {
        id: "email",
        header: () => <TableHeaderCell>Email</TableHeaderCell>,
        accessorKey: "email",
    },
    {
        accessorKey: "role",
        header: () => <TableHeaderCell>Role</TableHeaderCell>,
        cell: ({ row }) => {
            const role = row.getValue("role") as string;

            return (
                <div>{getUserRoleBadge(role)}</div>
            );
        }
    },
    {
        accessorKey: "status",
        header: () => <TableHeaderCell>Status</TableHeaderCell>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            return (
                <div>{getUserStatusBadge(status)}</div>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: () => <TableHeaderCell>Created</TableHeaderCell>,
        cell: ({ row }) => {
            const dateString = row.getValue("createdAt") as string;
            const formattedDate = formatUserDate(dateString);

            return (
                <p>{formattedDate}</p>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            const { mutate: updateUserRole, isPending: isRolePending } = useUpdateUserRole(user.id);
            const { mutate: updateUserStatus, isPending: isStatusPending } = useUpdateUserStatus(user.id);

            const handleCopyId = async () => {
                try {
                    await navigator.clipboard.writeText(user.id);
                    toast.success("Order ID copied to clipboard");
                } catch (error) {
                    toast.error("Failed to copy order ID");
                }
            }

            const handleView = () => {
                window.location.href = `/admin/users/${user.id}`;
            }

            const handleEdit = () => {
                window.location.href = `/admin/users/${user.id}/edit`;
            }

            const handleToggleRole = () => {
                const newRole: UserRole = user.role === "ADMIN" ? "USER" : "ADMIN";
                const operation = newRole === "ADMIN" ? "PROMOTE" : "DEMOTE";

                const validation = validateUserOperation(user, operation, user.id);
                if (!validation.isValid) {
                    toast.error(validation.message);
                    return;
                }

                updateUserRole({ role: newRole })
            }

            const handleToggleStatus = () => {
                const newStatus: UserStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
                const operation = newStatus === "BANNED" ? "BAN" : "UNBAN";

                const validation = validateUserOperation(user, operation, user.id);
                if (!validation.isValid) {
                    toast.error(validation.message);
                    return;
                }

                updateUserStatus({ status: newStatus })
            }

            const isCurrentlyAdmin = user.role === "ADMIN";
            const roleActionText = isCurrentlyAdmin ? "Remove admin" : "Make admin";

            const isCurrentlyActive = user.status === "ACTIVE";
            const statusActionText = isCurrentlyActive ? "Ban user" : "Unban user";

            return (
                <div className={"text-right"}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} className={"h-8 w-8 p-0 hover:bg-secondary"}>
                                <span className={"sr-only"}>Open menu</span>
                                <MoreHorizontal className={"h-4 w-4"} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={"end"}>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={handleView}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit user
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={handleToggleRole}
                                disabled={isRolePending}
                            >
                                <Shield className="mr-2 h-4 w-4" />
                                {isRolePending ? "Updating..." : roleActionText}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={handleToggleStatus}
                                disabled={isStatusPending}
                            >
                                <Ban className="mr-2 h-4 w-4" />
                                {isStatusPending ? "Updating..." : statusActionText}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled
                                className={"text-destructive focus:text-destructive"}
                            >
                                <Trash2 className={"mr-2 h-4 w-4"} />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    }
]