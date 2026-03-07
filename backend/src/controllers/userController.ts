import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prisma';
import AppError from '../utils/appError';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc    Get current logged in user profile
// @route   GET /api/users/me
// @access  Private (Any authenticated user)
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    Get all users (for management panel)
// @route   GET /api/users
// @access  Private (Admin only)
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.status(200).json({
        success: true,
        results: users.length,
        data: users,
    });
});

// @desc    Get all providers
// @route   GET /api/users/providers
// @access  Private (Any authenticated user)
export const getProviders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const providers = await prisma.user.findMany({
        where: { role: 'PROVIDER' },
        select: { id: true, name: true, email: true, createdAt: true },
    });

    res.status(200).json({
        success: true,
        results: providers.length,
        data: providers,
    });
});
