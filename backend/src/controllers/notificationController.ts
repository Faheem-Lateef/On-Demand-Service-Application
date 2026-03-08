import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/authMiddleware';
import { NotificationService } from '../services/notificationService';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const notifications = await NotificationService.getMyNotifications(req.user!.id);
    res.status(200).json({
        success: true,
        results: notifications.length,
        data: notifications,
    });
});

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    await NotificationService.markAsRead(req.params.id as string, req.user!.id);
    res.status(200).json({ success: true, message: 'Notification marked as read' });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    await NotificationService.markAllAsRead(req.user!.id);
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

