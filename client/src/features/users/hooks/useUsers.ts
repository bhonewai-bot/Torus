"use client";

import { useQuery } from "@tanstack/react-query";
import { UserFilters } from "../types/user.types";
import { userKeys } from "../lib/user.query.keys";
import { userService } from "../services/user.services";
import { updateUserRoleDto, updateUserStatusDto } from "../utils/user.schema";
import { useOptimisticUpdate } from "@/hooks/useOptimisticUpdate";
import { userUpdateConfigs } from "../config/user.config";

export function useUsers(filters: UserFilters = {}) {
    return useQuery({
        queryKey: userKeys.list(filters),
        queryFn: () => userService.getUsers(filters),
    });
}

export function useUser(id: string) {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => userService.getUser(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdateUserRole(userId: string) {
    return useOptimisticUpdate({
        entityId: userId,
        mutationFn: (data: updateUserRoleDto) => userService.updateUserRole(userId, data),
        config: userUpdateConfigs.role
    })
}

export function useUpdateUserStatus(userId: string) {
    return useOptimisticUpdate({
        entityId: userId,
        mutationFn: (data: updateUserStatusDto) => userService.updateUserStatus(userId, data),
        config: userUpdateConfigs.status
    });
}