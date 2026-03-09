import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prisma';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getDashboardStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Run all aggregate queries strictly in the database efficiently via a transaction
    const [
        totalUsers,
        totalServices,
        totalBookings,
        pendingBookings,
        activeProviders
    ] = await prisma.$transaction([
        prisma.user.count(),
        prisma.service.count(),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: 'PENDING' } }),
        prisma.user.count({ where: { role: 'PROVIDER', providerStatus: 'APPROVED' } })
    ]);

    res.status(200).json({
        success: true,
        data: {
            users: totalUsers,
            services: totalServices,
            bookings: totalBookings,
            pendingBookings,
            activeProviders
        }
    });
});
