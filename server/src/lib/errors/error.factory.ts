import { Request } from "express";
import { BaseError, ErrorContext } from "./base.error";
import { ZodError } from "zod";
import { ValidationError } from "./validation.error";
import { Prisma } from "@prisma/client";
import { DatabaseError } from "./database.error";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError, UnauthorizedError } from "./http.errors";

export class ErrorFactory {
    public static createRequestContext(req: Request): ErrorContext {
        return {
            requestId: req.headers["x-request-id"] as string,
            userId: (req as any).user?.id,
            userAgent: req.headers["user-agent"],
            ip: req.ip || req.connection.remoteAddress,
            route: req.route?.path,
            method: req.method,
            url: req.url,
            body: req.method !== "GET" ? req.body : undefined,
            query: Object.keys(req.query).length > 0 ? req.query : undefined,
        }
    }

    public static fromZodError(zodError: ZodError, req?: Request): ValidationError {
        const context = req ? this.createRequestContext(req) : undefined;
        return ValidationError.fromZodError(zodError, context);
    }

    public static fromPrismaError(
        prismaError: Prisma.PrismaClientKnownRequestError,
        req?: Request,
        additionalContext?: ErrorContext
    ): DatabaseError {
        const context = req ? this.createRequestContext(req) : undefined;
        const combinedContext = context ? { ...context, ...additionalContext } : additionalContext;
        return DatabaseError.fromPrismaError(prismaError, combinedContext);
    }

    public static fromUnknownError(error: unknown, req?: Request): BaseError {
        const context = req ? this.createRequestContext(req) : undefined;

        if (error instanceof BaseError) {
            if (context) {
                Object.assign(error.metadata, context);
            }
            return error;
        }

        if (error instanceof ZodError) {
            return this.fromZodError(error, req);
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return this.fromPrismaError(error, req);
        }

        if (error instanceof Error) {
            return new InternalServerError(error.message, context);
        }

        return new InternalServerError("An unknown error occoured", context);
    }

    public static notFound(resource: string = "Resource", req?: Request): NotFoundError {
        const context = req ? this.createRequestContext(req) : undefined;
        return new NotFoundError(`${resource} not found`, context);
    }

    public static badRequest(message: string, req?: Request): BadRequestError {
        const context = req ? this.createRequestContext(req) : undefined;
        return new BadRequestError(message, context);
    }

    public static unauthorized(message?: string, req?: Request): UnauthorizedError {
        const context = req ? this.createRequestContext(req) : undefined;
        return new UnauthorizedError(message, context);
    }

    public static createError(
        message: string,
        statusCode: number,
        errorCode: string,
        req?: Request,
        additionalContext?: ErrorContext
    ): BaseError {
        const context = req ? this.createRequestContext(req) : undefined;
        const combinedContext = context ? { ...context, ...additionalContext } : additionalContext;

        switch (statusCode) {
            case 400:
                return new BadRequestError(message, combinedContext);
            case 401:
                return new UnauthorizedError(message, combinedContext);
            case 404:
                return new NotFoundError(message, combinedContext);
            case 409:
                return new ConflictError(message, combinedContext);
            case 500:
            default:
                return new InternalServerError(message, combinedContext);
        }
    }
}