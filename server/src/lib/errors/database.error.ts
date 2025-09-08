import { Prisma } from "@prisma/client";
import { BaseError, ErrorContext } from "./base.error";

export class DatabaseError extends BaseError {
    public readonly operation?: string;
    public readonly table?: string;

    constructor(
        message: string,
        statusCode: number = 500,
        errorCode: string = "DATABASE_ERROR",
        originalError?: unknown,
        context?: ErrorContext,
    ) {
        super(message, statusCode, errorCode, true, originalError, context);

        if (context) {
            this.operation = context.operation as string;
            this.table = context.table as string;
        }
    }

    public static fromPrismaError(
        prismaError: Prisma.PrismaClientKnownRequestError,
        context?: ErrorContext,
    ): DatabaseError {
        const errorMap: Record<string, { message: string; statusCode: number; code: string }> = {
            "P2002": {
                message: "Unique constraint violation",
                statusCode: 409,
                code: "DUPLICATE_ENTEY",
            },
            "P2025": {
                message: "Record not found",
                statusCode: 404,
                code: "RECORD_NOT_FOUND",
            },
            "P2003": {
                message: "Foreign key constraint violation",
                statusCode: 400,
                code: "FOREIGN_KEY_VIOLATION",
            },
            "P2004": {
                message: "A constraint failed on the database",
                statusCode: 400,
                code: "CONSTRAINT_VIOLATION",
            },
            "P2014": {
                message: "Invalid ID provided in where condition",
                statusCode: 400,
                code: "INVALID_ID",
            },
            "P2021": {
                message: "Table does not exist",
                statusCode: 500,
                code: "TABLE_NOT_EXISTS",
            },
            "P2022": {
                message: "Column does not exist",
                statusCode: 500,
                code: "COLUMN_NOT_EXISTS",
            }
        }

        const errorInfo = errorMap[prismaError.code] || {
            message: "Database opeartion failed",
            statusCode: 500,
            code: "DATABASE_ERROR",
        };

        return new DatabaseError(
            errorInfo.message,
            errorInfo.statusCode,
            errorInfo.code,
            prismaError,
            {
                ...context,
                prismaCode: prismaError.code,
                target: prismaError.meta?.target,
            }
        )
    }

    public toResponse() {
        return {
            ...super.toResponse(),
            operation: this.operation,
            table: this.table,
        }
    }
}