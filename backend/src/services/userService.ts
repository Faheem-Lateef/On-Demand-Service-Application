import prisma from '../utils/prisma';
import AppError from '../utils/appError';

export class UserService {
    static async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    static async getAllUsers() {
        return await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
    }

    static async getProviders() {
        return await prisma.user.findMany({
            where: { role: 'PROVIDER' },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                createdAt: true,
                providerBookings: {
                    select: {
                        service: {
                            include: { category: true }
                        }
                    },
                    take: 10,
                }
            },
        });
    }

    static async getProviderBookings(userId: string) {
        return await prisma.booking.findMany({
            where: {
                OR: [
                    { providerId: userId },
                    { providerId: null, status: 'PENDING' }
                ]
            },
            include: {
                customer: { select: { id: true, name: true, email: true } },
                service: { include: { category: true } },
            },
            orderBy: { scheduledAt: 'asc' },
        });
    }
}
