export interface User {
    id: string;
    name: string;
    email: string;
}

export interface UserDetail extends User {
    phone?: string;
    enabled: boolean;
    createdAt: string;
}