export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface BaseApiResponse {
    success: boolean;
    message: string;
}

export interface PaginatedApiResponse<T> extends BaseApiResponse {
    data: {
        items: T[];
        pagination: PaginationInfo;
    }
}

export interface SingleItemApiResponse<T> extends BaseApiResponse {
    data: T;
}