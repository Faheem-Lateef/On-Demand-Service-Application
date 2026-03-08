import { z } from 'zod';


export const createBookingSchema = z.object({
    body: z.object({
        serviceId: z.string().min(1, 'Service ID is required'),
        scheduledTime: z.string().min(1, 'Scheduled time is required')
            .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
        address: z.string().min(1, 'Address is required')
            .min(5, 'Address must be at least 5 characters'),
        notes: z.string().optional(),
        providerId: z.string().optional(),
    }),
});

export const updateBookingStatusSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Booking ID is required'),
    }),
    body: z.object({
        status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED']),
    }),
});

export const bookingIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Booking ID is required'),
    }),
});
