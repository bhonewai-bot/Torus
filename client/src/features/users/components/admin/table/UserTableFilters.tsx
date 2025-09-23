import { createTableFilter, FilterField } from "@/components/common/TableFilterFactory";
import { USER_ROLES, USER_STATUSES, UserFilters } from "@/features/users/types/user.types";

interface UserTableFiltersProps {
    filters: UserFilters;
    onFilterChange: (filters: Partial<UserFilters>) => void;
}

const UserTableFilter = createTableFilter<UserFilters>();

export function UserTableFilters({
    filters,
    onFilterChange,
}: UserTableFiltersProps) {
    const filterFields: FilterField[] = [
        {
            key: "role",
            placeholder: "User Role",
            width: "w-40",
            allOption: {
                value: "all",
                label: "All Roles"
            },
            options: USER_ROLES.map(role => ({
                value: role,
                label: role.charAt(0) + role.slice(1).toLowerCase()
            }))
        },
        {
            key: "status",
            placeholder: "User Status",
            width: "w-40",
            allOption: {
                value: "all",
                label: "All Status"
            },
            options: USER_STATUSES.map(status => ({
                value: status,
                label: status.charAt(0) + status.slice(1).toLowerCase()
            }))
        }
    ];

    return (
        <UserTableFilter
            filters={filters}
            onFilterChange={onFilterChange}
            config={{
                searchPlaceholder: "Search users...",
                filterFields
            }}
        />
    );
}