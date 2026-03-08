import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';

const signToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: '15m',
    });
};

const signRefreshToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh'), {
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

    res.status(200).json({
        success: true,
        data: {
            user,
            token,
            refreshToken
        },
    });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('Refresh token is required', 400));
    }

    try {
        const decoded = jwt.verify(refreshToken, (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh')) as { id: string, role: string };

        // Ensure user still exists in DB
        const user = await UserService.getUserById(decoded.id);

        const newAccessToken = signToken(user.id, user.role);

        res.status(200).json({
            success: true,
            data: {
                token: newAccessToken
            }
        });
    } catch (error) {
        return next(new AppError('Invalid or expired refresh token', 401));
    }
});
