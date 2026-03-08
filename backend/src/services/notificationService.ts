import prisma from '../utils/prisma';

export class NotificationService {
    // Fetch the most recent 50 notifications for a user, newest first
    static async getMyNotifications(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    // Mark a single notification as read, scoped to the owning user
    static async markAsRead(id: string, userId: string) {
        await prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }

    // Mark every unread notification as read for a user
    static async markAllAsRead(userId: string) {
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
}
