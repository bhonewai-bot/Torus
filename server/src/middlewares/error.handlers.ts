import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
}

export const createError = (message: string, statusCode: number = 500, code?: string): ApiError => {
    const error = new Error(message) as ApiError;
    error.statusCode = statusCode;
    error.code = code;
    return error;
};

export const notFoundError = (resource: string = 'Resource'): ApiError => {
    return createError(`${resource} not found`, 404, 'NOT_FOUND');
};

export const validationError = (message: string = 'Validation failed'): ApiError => {
    return createError(message, 400, 'VALIDATION_ERROR');
};

export const errorHandler = (
    error: Error | ApiError | ZodError | Prisma.PrismaClientKnownRequestError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({
                    success: false,
                    message: 'Unique constraint violation',
                    code: 'DUPLICATE_ENTRY',
                });
            case 'P2025':
                return res.status(404).json({
                    success: false,
                    message: 'Record not found',
                    code: 'NOT_FOUND',
                });
            default:
                return res.status(500).json({
                    success: false,
                    message: 'Database error',
                    code: 'DATABASE_ERROR',
                });
        }
    }

    // Handle custom API errors
    const apiError = error as ApiError;
    const statusCode = apiError.statusCode || 500;
    const message = apiError.message || 'Internal server error';
    const code = apiError.code || 'INTERNAL_ERROR';

    res.status(statusCode).json({
        success: false,
        message,
        code,
    });
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        code: 'ENDPOINT_NOT_FOUND',
    });
};
