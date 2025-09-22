import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getUserRoleConfig, getUserStatusConfig } from "@/lib/utils/status.config";

export const getUserRoleBadge = (status: string) => {
    const config = getUserRoleConfig(status);
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={cn("gap-1.5 font-medium", config.className)}>
            {Icon && <Icon className="h-3 w-3" />}
            {config.label}
        </Badge>
    );
}

export const getUserStatusBadge = (status: string) => {
    const config = getUserStatusConfig(status);
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={cn("gap-1.5 font-medium", config.className)}>
            <Icon className="h-3 w-3" />
            {config.label}
        </Badge>
    );
}