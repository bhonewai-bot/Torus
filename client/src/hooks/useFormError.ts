import { BaseError, ValidationError } from "@/lib/errors";
import { useCallback, useState } from "react";

interface FormError {
    field: string;
    message: string;
}

interface FormErrorState {
    errors: FormError[];
    hasErrors: boolean;
    getFieldError: (field: string) => string | undefined;
    setFieldError: (field: string, message: string) => void;
    clearFieldError: (field: string) => void;
    setErrors: (errors: FormError[]) => void;
    clearErrors: () => void;
    handleError: (error: unknown) => void;
}

export function useFormError(): FormErrorState {
    const [errors, setErrorsState] = useState<FormError[]>([]);

    const getFieldError = useCallback((field: string) => {
        return errors.find(error => error.field === field)?.message;
    }, [errors]);

    const setFieldError = useCallback((field: string, message: string) => {
        setErrorsState(prev => {
            const filtered = prev.filter(error => error.field !== field);
            return [...filtered, { field, message }];
        });
    }, []);

    const clearFieldError = useCallback((field: string) => {
        setErrorsState(prev => prev.filter(error => error.field !== field));
    }, []);

    const setErrors = useCallback((newErrors: FormError[]) => {
        setErrorsState(newErrors);
    }, []);

    const clearErrors = useCallback(() => {
        setErrorsState([]);
    }, []);

    const handleError = useCallback((error: unknown) => {
        if (error instanceof ValidationError) {
            const formErrors: FormError[] = error.issues.map(issue => ({
                field: issue.field,
                message: issue.message
            }));
            setErrors(formErrors);
        } else if (error instanceof BaseError) {
            // For non-validation errors, show as a general form error
            setFieldError('general', error.message);
        } else {
            setFieldError('general', 'An unexpected error occurred');
        }
    }, [setErrors, setFieldError]);

    return {
        errors,
        hasErrors: errors.length > 0,
        getFieldError,
        setFieldError,
        clearFieldError,
        setErrors,
        clearErrors,
        handleError,
    };
}