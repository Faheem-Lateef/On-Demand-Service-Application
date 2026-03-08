import prisma from '../utils/prisma';
import AppError from '../utils/appError';
import { BookingStatus } from '@prisma/client';
import { sendMockPushNotification } from '../utils/pushNotifications';

export class BookingService {
    static async createBooking(data: { customerId: string, serviceId: string, scheduledTime: string, address: string, notes?: string, providerId?: string }) {
        const { customerId, serviceId, scheduledTime, address, notes, providerId } = data;
        const bookingDate = new Date(scheduledTime);

        if (bookingDate <= new Date()) {
            throw new AppError('Scheduled time must be in the future', 400);
        }

        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) {
            throw new AppError('Service not found', 404);
        }

        if (providerId) {
            const provider = await prisma.user.findUnique({
                where: { id: providerId },
                select: { role: true }
            });
            if (!provider || provider.role !== 'PROVIDER') {
                throw new AppError('Invalid provider selected', 400);
            }
        }

        const bookingResult = await prisma.$transaction(async (tx) => {
            const booking = await tx.booking.create({
                data: {
                    customerId,
                    serviceId,
                    providerId: providerId || null,
                    scheduledAt: bookingDate,
                    address,
                    notes,
                    totalAmount: service.price,
                    status: BookingStatus.PENDING,
                },
                include: {
                    service: { include: { category: true } },
                    customer: { select: { id: true, name: true } },
                }
            });

            if (providerId) {
                await tx.notification.create({
                    data: {
                        userId: providerId,
                        title: 'New Booking Request',
                        message: `${booking.customer.name} requested your ${booking.service.name} service.`
                    }
                });
            }

            return booking;
        });

        return bookingResult;
    }

    static async getMyBookings(userId: string, role: string, { page, limit }: { page: number; limit: number }) {
        const skip = (page - 1) * limit;
        let query: any = {};

        if (role === 'CUSTOMER') {
            query.customerId = userId;
        } else if (role === 'PROVIDER') {
            query = {
                OR: [
                    { providerId: userId },
                    { providerId: null, status: BookingStatus.PENDING }
                ]
            };
        }

        const [data, total] = await prisma.$transaction([
            prisma.booking.findMany({
                where: query,
                skip,
                take: limit,
                include: {
                    customer: { select: { id: true, name: true, email: true } },
                    service: { include: { category: true } },
                },
                orderBy: { scheduledAt: 'asc' }
            }),
            prisma.booking.count({ where: query }),
        ]);

        return { data, total };
    }

    static async getAllBookings({ page, limit }: { page: number; limit: number }) {
        const skip = (page - 1) * limit;

        const [data, total] = await prisma.$transaction([
            prisma.booking.findMany({
                skip,
                take: limit,
                include: {
                    customer: { select: { id: true, name: true, email: true } },
                    provider: { select: { id: true, name: true, email: true } },
                    service: { include: { category: true } },
                },
                orderBy: { scheduledAt: 'desc' },
            }),
            prisma.booking.count(),
        ]);

        return { data, total };
    }

    static async updateBookingStatus(id: string, status: string) {
        if (!Object.values(BookingStatus).includes(status as any)) {
            throw new AppError('Invalid booking status', 400);
        }

        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: status as BookingStatus },
            include: {
                customer: { select: { id: true, name: true, email: true } },
                service: true
            }
        });

        const pushBody = `Your booking for "${updatedBooking.service.name}" has been marked as ${status}.`;
        sendMockPushNotification(updatedBooking.customerId, 'Booking Status Update', pushBody).catch(console.error);

        return updatedBooking;
    }

    static async acceptBooking(id: string, providerId: string) {
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            throw new AppError('Booking not found', 404);
        }
        if (booking.status !== BookingStatus.PENDING) {
            throw new AppError('Only PENDING bookings can be accepted', 400);
        }

        const updatedBookingResult = await prisma.$transaction(async (tx) => {
            const updatedBooking = await tx.booking.update({
                where: { id },
                data: {
                    status: BookingStatus.ACCEPTED,
                    providerId,
                },
                include: {
                    customer: { select: { id: true, name: true, email: true } },
                    service: { include: { category: true } },
                    provider: { select: { name: true } }
                }
            });

            await tx.notification.create({
                data: {
                    userId: updatedBooking.customerId,
                    title: 'Booking Accepted! 🎉',
                    message: `${updatedBooking.provider?.name || 'A professional'} has accepted your ${updatedBooking.service.name} request.`
                }
            });

            return updatedBooking;
        });

        return updatedBookingResult;
    }

    static async rejectBooking(id: string) {
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            throw new AppError('Booking not found', 404);
        }
        if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.ACCEPTED) {
            throw new AppError('This booking cannot be rejected in its current state', 400);
        }

        const updatedBookingResult = await prisma.$transaction(async (tx) => {
            const updatedBooking = await tx.booking.update({
                where: { id },
                data: { status: BookingStatus.REJECTED },
                include: {
                    customer: { select: { id: true, name: true, email: true } },
                    service: { include: { category: true } },
                }
            });

            await tx.notification.create({
                data: {
                    userId: updatedBooking.customerId,
                    title: 'Booking Update',
                    message: `We're sorry, but the professional had to reject your ${updatedBooking.service.name} request. Please try another provider.`
                }
            });

            return updatedBooking;
        });

        return updatedBookingResult;
    }
}
