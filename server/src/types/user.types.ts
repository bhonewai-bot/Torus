import { UserRole, UserStatus } from '@prisma/client';

export interface UserList {
    id: string;
    avatar?: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
}

export interface UserDetail {
    id: string;
    avatar?: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    orders?: {
        
    }
}