import { ErrorFactory } from '@src/lib/errors';
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const validate = (schema: z.ZodObject<any, any>, part: 'body' | 'params' | 'query') => (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = schema.parse(req[part]);
        res.locals.validatedData = parsedData;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            // Let the global error handler process the validation error
            // This will use ErrorFactory.fromZodError() and return proper format
            const validationError = ErrorFactory.fromZodError(error, req);
            next(validationError);
        } else {
            next(error);
        }
    }
};

export const validateBody = (schema: z.ZodObject<any, any>) => validate(schema, 'body');
export const validateParams = (schema: z.ZodObject<any, any>) => validate(schema, 'params');
export const validateQuery = (schema: z.ZodObject<any, any>) => validate(schema, 'query');