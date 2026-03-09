import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middlewares/authMiddleware';

const signToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: '15m',
    });
};

const signRefreshToken = (id: string, role: string) => {
    // JWT_REFRESH_SECRET is required — no fallback. The server will throw if it is missing.
    return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: '7d',
    });
};

// @desc    Register a new user (Customer or Provider)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.registerUser(req.body);

    // Generate JWT tokens
    const token = signToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);

    // Store SHA-256 hash of the refresh token for server-side revocation
    await AuthService.storeRefreshToken(user.id, refreshToken);

    res.status(201).json({
        success: true,
        data: { user, token, refreshToken },
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.loginUser(req.body);

    // Generate JWT tokens
    const token = signToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);

    // Store SHA-256 hash of the refresh token for server-side revocation
    await AuthService.storeRefreshToken(user.id, refreshToken);

    res.status(200).json({
        success: true,
        data: {
            user,
            token,
            refreshToken
        },
    });
});

// @desc    Refresh access token (validates against stored hash + rotates token)
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('Refresh token is required', 400));
    }

    try {
        // 1. Verify signature and expiry
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string, role: string };

        // 2. Validate against stored DB hash (catches tokens issued before last logout)
        const user = await AuthService.validateRefreshToken(decoded.id, refreshToken);

        // 3. Rotate: generate a new refresh token and update the stored hash
        const newAccessToken = signToken(user.id, user.role);
        const newRefreshToken = signRefreshToken(user.id, user.role);
        await AuthService.storeRefreshToken(user.id, newRefreshToken);

        res.status(200).json({
            success: true,
            data: {
                token: newAccessToken,
                refreshToken: newRefreshToken,
            }
        });
    } catch (error) {
        return next(new AppError('Invalid or expired refresh token', 401));
    }
});

// @desc    Logout user (clears stored refresh token, invalidating future refreshes)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    await AuthService.clearRefreshToken(req.user!.id);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});
