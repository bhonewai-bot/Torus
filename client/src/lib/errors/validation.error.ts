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
        context?: ErrorContext,
    ) {
        super(message, 400, "VALIDATION_ERROR", true, undefined, context);
        this.issues = issues;
    }

    public addIssues(issue: ValidationIssue): void {
        this.issues.push(issue);
    }

    public toJSON() {
        return {
            ...super.toJSON(),
            issues: this.issues,
        }
    }
}