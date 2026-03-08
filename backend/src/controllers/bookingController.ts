import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/authMiddleware';
import { BookingService } from '../services/bookingService';

// @desc    Create a new booking (optionally linked to a specific provider)
// @route   POST /api/bookings
// @access  Private (Customer only)
export const createBooking = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const booking = await BookingService.createBooking({
        ...req.body,
        customerId: req.user!.id
    });
    res.status(201).json({ success: true, data: booking });
});

// @desc    Get user's bookings (role-aware)
// @route   GET /api/bookings/my-bookings?page=1&limit=20
// @access  Private
export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const { data, total } = await BookingService.getMyBookings(req.user!.id, req.user!.role, { page, limit });
    res.status(200).json({
        success: true,
        results: data.length,
        total,
        page,
        limit,
        data,
    });
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings?page=1&limit=20
// @access  Private
export const getAllBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const { data, total } = await BookingService.getAllBookings({ page, limit });
    res.status(200).json({
        success: true,
        results: data.length,
        total,
        page,
        limit,
        data,
    });
});

// @desc    Update booking status (generic endpoint for admin)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin or Provider)
export const updateBookingStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const updatedBooking = await BookingService.updateBookingStatus(req.params.id as string, req.body.status);
    res.status(200).json({ success: true, data: updatedBooking });
});

// @desc    Provider accepts a booking (self-assigns and sets status to ACCEPTED)
// @route   PATCH /api/bookings/:id/accept
// @access  Private (Provider only)
export const acceptBooking = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const updatedBooking = await BookingService.acceptBooking(req.params.id as string, req.user!.id);
    res.status(200).json({ success: true, data: updatedBooking });
});

// @desc    Provider rejects a booking
// @route   PATCH /api/bookings/:id/reject
// @access  Private (Provider only)
export const rejectBooking = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const updatedBooking = await BookingService.rejectBooking(req.params.id as string);
    res.status(200).json({ success: true, data: updatedBooking });
});
