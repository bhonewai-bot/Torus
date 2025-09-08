import { ZodError, ZodIssue } from "zod";
import { BaseError, ErrorContext } from "./base.error";

export interface ValidationIssue {
    field: string;
    message: string;
    code: string;
    value?: unknown;
}

export class ValidationError extends BaseError {
    public readonly issues: ValidationIssue[];

    constructor(
        message: string = "Validation failed",
        issues: ValidationIssue[] = [],
        originalError?: unknown,
        context?: ErrorContext,
    ) {
        super(message, 400, "VALIDATION_ERROR", true, originalError, context);
        this.issues = issues;
    }

    public static fromZodError(zodError: ZodError, context?: ErrorContext): ValidationError {
        const issues: ValidationIssue[] = zodError.issues.map((issue: ZodIssue) => ({
            field: issue.path.join(".") || "root",
            message: issue.message,
            code: issue.code,
            value: (issue as any).received,
        }));

        return new ValidationError("Validation failed", issues, zodError, context);
    }

    public addIssue(issue: ValidationIssue): void {
        this.issues.push(issue);
    }

    public toResponse() {
        return {
            ...super.toResponse(),
            issues: this.issues,
        }
    }

    public toJSON() {
        return {
            ...super.toJSON(),
            issues: this.issues,
        }
    }
}