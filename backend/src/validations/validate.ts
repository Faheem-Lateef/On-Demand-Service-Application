import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import AppError from '../utils/appError';

/**
 * Generic Zod validation middleware factory.
 * Validates req.body, req.query, and req.params against the provided schema.
 * Returns a 400 AppError with a descriptive message on failure.
 */
export const validate = (schema: z.ZodObject<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }
            return next(error);
        }
    };
