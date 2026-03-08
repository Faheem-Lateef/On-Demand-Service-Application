import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserService } from '../services/userService';

// @desc    Get current logged in user profile
// @route   GET /api/users/me
// @access  Private (Any authenticated user)
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await UserService.getUserById(req.user!.id);
    res.status(200).json({ success: true, data: user });
});

// @desc    Get all users (for management panel)
// @route   GET /api/users
// @access  Private (Admin only)
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUsers();
    res.status(200).json({ success: true, results: users.length, data: users });
});

// @desc    Get all providers with their related services (enriched for marketplace)
// @route   GET /api/users/providers
// @access  Private (Any authenticated user)
export const getProviders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const providers = await UserService.getProviders();
    res.status(200).json({ success: true, results: providers.length, data: providers });
});

// @desc    Get all bookings assigned to or available for the logged-in provider
// @route   GET /api/users/provider-bookings
// @access  Private (Provider only)
export const getProviderBookings = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const bookings = await UserService.getProviderBookings(req.user!.id);
    res.status(200).json({ success: true, results: bookings.length, data: bookings });
});
