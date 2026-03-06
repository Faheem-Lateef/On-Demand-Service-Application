import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prisma';
import AppError from '../utils/appError';
import { AuthRequest } from '../middlewares/authMiddleware';
import { BookingStatus } from '@prisma/client';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer only)
export const createBooking = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { serviceId, scheduledTime, address, notes } = req.body;

    if (!serviceId || !scheduledTime) {
        return next(new AppError('Service ID and scheduled time are required', 400));
    }

    // Ensure scheduled time is in the future
    const bookingDate = new Date(scheduledTime);
    if (bookingDate <= new Date()) {
        return next(new AppError('Scheduled time must be in the future', 400));
    }
    const service = await prisma.service.findUnique({
        where: { id: serviceId }
    });

    if (!service) {
        return next(new AppError('Service not found', 404));
    }

    const booking = await prisma.booking.create({
        data: {
            customerId: req.user!.id,
            serviceId,
            scheduledAt: bookingDate,
            address,
            notes,
            totalAmount: service.price,
            status: BookingStatus.PENDING,
        },
        include: {
            service: {
                include: {
                    category: true
                }
            }
        }
    });

    res.status(201).json({
        success: true,
        data: booking,
    });
});

// @desc    Get user's bookings (Customer sees theirs, Provider/Admin see relevant)
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    let query: any = {};

    if (req.user?.role === 'CUSTOMER') {
        query.customerId = req.user.id;
    } else if (req.user?.role === 'PROVIDER') {
        // For MVP, providers can see all pending or their assigned bookings
        // Currently, we don't have a direct 'assignedProvider' field in Booking, 
        // Usually providers pick up PENDING tasks.
        query.status = { in: [BookingStatus.PENDING, BookingStatus.ACCEPTED] };
    } else if (req.user?.role === 'ADMIN') {
        query = {}; // Admin sees all
    }

    const bookings = await prisma.booking.findMany({
        where: query,
        include: {
            customer: {
                select: { id: true, name: true, email: true }
            },
            service: {
                include: {
                    category: true
                }
            }
        },
        orderBy: {
            scheduledAt: 'asc'
        }
    });

    res.status(200).json({
        success: true,
        results: bookings.length,
        data: bookings,
    });
});

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin or Provider)
export const updateBookingStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    if (!Object.values(BookingStatus).includes(status)) {
        return next(new AppError('Invalid booking status', 400));
    }

    const booking = await prisma.booking.findUnique({
        where: { id: id as string }
    });

    if (!booking) {
        return next(new AppError('Booking not found', 404));
    }

    const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status },
        include: {
            customer: {
                select: { id: true, name: true, email: true }
            },
            service: true
        }
    });

    // SIMULATED PUSH NOTIFICATION (Bonus Feature)
    // Send notification to the customer about the status change
    const pushTitle = `Booking Status Update`;
    const pushBody = `Your booking for "${updatedBooking.service.name}" has been marked as ${status}.`;

    // We import locally here to avoid circular dependencies if any, or just import at the top. Let's import at top later, or just require it here for simplicity.
    const { sendMockPushNotification } = require('../utils/pushNotifications');
    sendMockPushNotification(updatedBooking.customerId, pushTitle, pushBody).catch(console.error);

    res.status(200).json({
        success: true,
        data: updatedBooking,
    });
});
