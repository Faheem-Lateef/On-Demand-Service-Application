import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserService } from '../services/userService';

/** Parse page/limit from query string with safe defaults */
const getPagination = (query: Request['query']) => ({
    page: Math.max(1, parseInt(query.page as string) || 1),
    limit: Math.min(100, Math.max(1, parseInt(query.limit as string) || 20)),
});

// @desc    Get current logged in user profile
// @route   GET /api/users/me
// @access  Private (Any authenticated user)
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await UserService.getUserById(req.user!.id);
    res.status(200).json({ success: true, data: user });
});

// @desc    Get all users (for management panel)
// @route   GET /api/users?page=1&limit=20
// @access  Private (Admin only)
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const pagination = getPagination(req.query);
    const { data, total } = await UserService.getAllUsers(pagination);
    res.status(200).json({
        success: true,
        results: data.length,
        total,
        page: pagination.page,
        limit: pagination.limit,
        data,
    });
});

// @desc    Get all providers with their related services (enriched for marketplace)
// @route   GET /api/users/providers?page=1&limit=20
// @access  Private (Any authenticated user)
export const getProviders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const pagination = getPagination(req.query);
    const { data, total } = await UserService.getProviders(pagination);
    res.status(200).json({
        success: true,
        results: data.length,
        total,
        page: pagination.page,
        limit: pagination.limit,
        data,
    });
});

// @desc    Get all bookings assigned to or available for the logged-in provider
// @route   GET /api/users/provider-bookings?page=1&limit=20
// @access  Private (Provider only)
export const getProviderBookings = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const pagination = getPagination(req.query);
    const { data, total } = await UserService.getProviderBookings(req.user!.id, pagination);
    res.status(200).json({
        success: true,
        results: data.length,
        total,
        page: pagination.page,
        limit: pagination.limit,
        data,
    });
});

// @desc    Get all pending providers (for admin review)
// @route   GET /api/users/providers/pending?page=1&limit=20
// @access  Private (Admin only)
export const getPendingProviders = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const pagination = getPagination(req.query);
    const { data, total } = await UserService.getPendingProviders(pagination);
    res.status(200).json({
        success: true,
        results: data.length,
        total,
        page: pagination.page,
        limit: pagination.limit,
        data,
    });
});

// @desc    Approve a provider
// @route   PATCH /api/users/providers/:id/approve
// @access  Private (Admin only)
export const approveProvider = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await UserService.updateProviderStatus(req.params.id as string, 'APPROVED');
    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    Reject a provider
// @route   PATCH /api/users/providers/:id/reject
// @access  Private (Admin only)
export const rejectProvider = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await UserService.updateProviderStatus(req.params.id as string, 'REJECTED');
    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    await UserService.deleteUser(req.params.id as string);
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});
