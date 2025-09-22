import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import { getOrderStatusConfig, getPaymentStatusConfig } from "@/lib/utils/status.config";

export const getPaymentStatusBadge = (status: string) => {
    const config = getPaymentStatusConfig(status);
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={cn("gap-1.5 font-medium", config.className)}>
            <Icon className="h-3 w-3" />
            {config.label}
        </Badge>
    )
}

export const getOrderStatusBadge = (status: string) => {
    const config = getOrderStatusConfig(status);
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={cn("gap-1.5 font-medium", config.className)}>
            <Icon className="h-3 w-3" />
            {config.label}
        </Badge>
    );
};