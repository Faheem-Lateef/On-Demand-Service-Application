import prisma from '../utils/prisma';
import AppError from '../utils/appError';

export interface PaginationParams {
    page: number;
    limit: number;
}

export class UserService {
    static async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                categoryId: true,
                category: { select: { id: true, name: true } }
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    static async getAllUsers({ page, limit }: PaginationParams) {
        const skip = (page - 1) * limit;

        const [data, total] = await prisma.$transaction([
            prisma.user.findMany({
                skip,
                take: limit,
                select: { id: true, name: true, email: true, role: true, createdAt: true, providerStatus: true },
            }),
            prisma.user.count(),
        ]);

        return { data, total };
    }

    static async deleteUser(userId: string) {
        await prisma.$transaction([
            prisma.booking.deleteMany({ where: { OR: [{ customerId: userId }, { providerId: userId }] } }),
            prisma.notification.deleteMany({ where: { userId } }),
            prisma.user.delete({ where: { id: userId } })
        ]);
        return { success: true };
    }

    static async getProviders({ page, limit }: PaginationParams) {
        const skip = (page - 1) * limit;

        const [data, total] = await prisma.$transaction([
            prisma.user.findMany({
                where: { role: 'PROVIDER', providerStatus: 'APPROVED' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    createdAt: true,
                    categoryId: true,
                    category: {
                        select: { id: true, name: true }
                    },
                    providerBookings: {
                        select: {
                            service: {
                                include: { category: true }
                            }
                        },
                        take: 10,
                    }
                },
            }),
            prisma.user.count({ where: { role: 'PROVIDER', providerStatus: 'APPROVED' } }),
        ]);

        return { data, total };
    }

    static async getPendingProviders({ page, limit }: PaginationParams) {
        const skip = (page - 1) * limit;

        const [data, total] = await prisma.$transaction([
            prisma.user.findMany({
                where: { role: 'PROVIDER', providerStatus: 'PENDING' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    createdAt: true,
                    categoryId: true,
                    category: {
                        select: { id: true, name: true }
                    }
                },
            }),
            prisma.user.count({ where: { role: 'PROVIDER', providerStatus: 'PENDING' } }),
        ]);

        return { data, total };
    }

    static async updateProviderStatus(userId: string, newStatus: 'APPROVED' | 'REJECTED') {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== 'PROVIDER') {
            throw new AppError('Provider not found', 404);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { providerStatus: newStatus },
            select: { id: true, name: true, email: true, providerStatus: true }
        });

        // Optionally send a notification or email here
        // if (newStatus === 'APPROVED') { sendPush(..., 'Your account is approved!') }

        return updatedUser;
    }

    static async getProviderBookings(userId: string, { page, limit }: PaginationParams) {
        const skip = (page - 1) * limit;

        const [data, total] = await prisma.$transaction([
            prisma.booking.findMany({
                where: {
                    OR: [
                        { providerId: userId },
                        { providerId: null, status: 'PENDING' }
                    ]
                },
                skip,
                take: limit,
                include: {
                    customer: { select: { id: true, name: true, email: true } },
                    service: { include: { category: true } },
                },
                orderBy: { scheduledAt: 'asc' },
            }),
            prisma.booking.count({
                where: {
                    OR: [
                        { providerId: userId },
                        { providerId: null, status: 'PENDING' }
                    ]
                }
            }),
        ]);

        return { data, total };
    }
}

