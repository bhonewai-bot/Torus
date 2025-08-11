import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const validate = (schema: z.ZodObject<any, any>, part: 'body' | 'params' | 'query') => (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = schema.parse(req[part]);
        res.locals.validatedData = parsedData;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }
        next(error);
    }
};

export const validateBody = (schema: z.ZodObject<any, any>) => validate(schema, 'body');
export const validateParams = (schema: z.ZodObject<any, any>) => validate(schema, 'params');
export const validateQuery = (schema: z.ZodObject<any, any>) => validate(schema, 'query');