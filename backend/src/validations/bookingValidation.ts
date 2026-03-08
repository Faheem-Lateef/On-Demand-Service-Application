import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject } from 'zod';
import AppError from '../utils/appError';

export const validate = (schema: AnyZodObject) =>
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
                const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                return next(new AppError(message, 400));
            }
            return next(error);
        }
    };

export const createBookingSchema = z.object({
    body: z.object({
        serviceId: z.string({ required_error: 'Service ID is required' }),
        scheduledTime: z.string({ required_error: 'Scheduled time is required' })
            .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
        address: z.string({ required_error: 'Address is required' })
            .min(5, 'Address must be at least 5 characters'),
        notes: z.string().optional(),
        providerId: z.string().optional(),
    }),
});

export const updateBookingStatusSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'Booking ID is required' }),
    }),
    body: z.object({
        status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'], { required_error: 'Valid status is required' }),
    }),
});

export const bookingIdParamSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'Booking ID is required' }),
    }),
});
