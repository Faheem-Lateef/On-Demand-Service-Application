import prisma from '../utils/prisma';
import AppError from '../utils/appError';
import { BookingStatus } from '@prisma/client';
import { sendMockPushNotification } from '../utils/pushNotifications';

/**
 * BookingService handles all business logic related to project bookings,
 * including creation, status updates, and retrieval for different user roles.
 */
export class BookingService {
    
    /**
     * Creates a new booking entry in the database.
     * Includes validation for scheduled time, service availability, and optional provider assignment.
     */
    static async createBooking(data: { customerId: string, serviceId: string, scheduledTime: string, address: string, notes?: string, providerId?: string }) {
        const { customerId, serviceId, scheduledTime, address, notes, providerId } = data;
        
        // Convert input string to JavaScript Date object for comparison and storage
        const bookingDate = new Date(scheduledTime);

        // Validation: Prevent booking a service in the past
        if (bookingDate <= new Date()) {
            throw new AppError('Scheduled time must be in the future', 400);
        }

        // Database Verification: Ensure the service being booked actually exists
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) {
            throw new AppError('Service not found', 404);
        }

        // Optional Provider Validation: If the customer selected a specific professional
        if (providerId) {
            const provider = await prisma.user.findUnique({
                where: { id: providerId },
                select: { role: true }
            });
            // Ensure the assigned user ID belongs to someone with the PROVIDER role
            if (!provider || provider.role !== 'PROVIDER') {
                throw new AppError('Invalid provider selected', 400);
            }
        }

        // Transaction Management: Ensures both the booking creation AND the notification 
        // succeed together. If one fails, the entire operation is rolled back to prevent data inconsistency.
        const bookingResult = await prisma.$transaction(async (tx) => {
            // 1. Create the primary booking record
            const booking = await tx.booking.create({
                data: {
                    customerId,
                    serviceId,
                    providerId: providerId || null, // Can be null if it's an open job request
                    scheduledAt: bookingDate,
                    address,
                    notes,
                    totalAmount: service.price, // Store price at time of booking (denormalization)
                    status: BookingStatus.PENDING,
                },
                include: {
                    service: { include: { category: true } },
                    customer: { select: { id: true, name: true } },
                }
            });

            // 2. Alert the provider: Create an in-app notification record if a provider was specified
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

    /**
     * Retrieves bookings specifically for the logged-in user, filtered by their role.
     * Supports pagination via 'page' and 'limit' parameters.
     */
    static async getMyBookings(userId: string, role: string, { page, limit }: { page: number; limit: number }) {
        // Calculate the number of records to skip based on current page
        const skip = (page - 1) * limit;
        let query: any = {};

        // Role-based logic:
        // Customers only see their own bookings.
        if (role === 'CUSTOMER') {
            query.customerId = userId;
        } 
        // Providers see jobs assigned to them OR jobs that are still unassigned (PENDING)
        else if (role === 'PROVIDER') {
            query = {
                OR: [
                    { providerId: userId },
                    { providerId: null, status: BookingStatus.PENDING }
                ]
            };
        }

        // Execute count and data retrieval in a transaction for a consistent snapshot of the data
        const [data, total] = await prisma.$transaction([
            prisma.booking.findMany({
                where: query,
                skip,
                take: limit,
                include: {
                    customer: { select: { id: true, name: true, email: true } },
                    service: { include: { category: true } },
                },
                orderBy: { scheduledAt: 'asc' } // Show upcoming jobs first
            }),
            prisma.booking.count({ where: query }),
        ]);

        return { data, total };
    }

    /**
     * Global booking retrieval for Admin users.
     * Shows all bookings across the entire platform.
     */
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
                orderBy: { scheduledAt: 'desc' }, // Show newest bookings at the top
            }),
            prisma.booking.count(),
        ]);

        return { data, total };
    }

    /**
     * General purpose status update (usually for Admin use).
     * Also triggers a mock push notification to the customer.
     */
    static async updateBookingStatus(id: string, status: string) {
        // Validate that the provided status string matches our Prisma Enum
        if (!Object.values(BookingStatus).includes(status as any)) {
            throw new AppError('Invalid booking status', 400);
        }

        // Verify existence before attempting update
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

        // Trigger side effect: Mock push notification to inform the customer of the change
        const pushBody = `Your booking for "${updatedBooking.service.name}" has been marked as ${status}.`;
        sendMockPushNotification(updatedBooking.customerId, 'Booking Status Update', pushBody).catch(console.error);

        return updatedBooking;
    }

    /**
     * Allows a provider to 'claim' or 'accept' a PENDING job.
     * This self-assigns the providerId and updates the status.
     */
    static async acceptBooking(id: string, providerId: string) {
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            throw new AppError('Booking not found', 404);
        }
        // Business Rule: A provider cannot accept a job that's already accepted, rejected, or completed.
        if (booking.status !== BookingStatus.PENDING) {
            throw new AppError('Only PENDING bookings can be accepted', 400);
        }

        const updatedBookingResult = await prisma.$transaction(async (tx) => {
            // 1. Permanently link the provider to this booking
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

            // 2. Notify the customer that a professional is on their way
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

    /**
     * Allows a provider to reject a job request. 
     * If accepted previously, it reverts to REJECTED.
     */
    static async rejectBooking(id: string) {
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            throw new AppError('Booking not found', 404);
        }
        // Validation: Ensure the job is in a state where rejection makes sense
        if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.ACCEPTED) {
            throw new AppError('This booking cannot be rejected in its current state', 400);
        }

        const updatedBookingResult = await prisma.$transaction(async (tx) => {
            // 1. Update status to rejected
            const updatedBooking = await tx.booking.update({
                where: { id },
                data: { status: BookingStatus.REJECTED },
                include: {
                    customer: { select: { id: true, name: true, email: true } },
                    service: { include: { category: true } },
                }
            });

            // 2. Inform the customer so they can find another provider
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

    /**
     * Allows a provider to mark an ACCEPTED job as COMPLETED.
     * Completing a job requires the scheduled time to have passed.
     */
    static async completeBooking(id: string, providerId: string) {
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            throw new AppError('Booking not found', 404);
        }
        
        // Ensure the provider calling this is the one assigned to the job
        if (booking.providerId !== providerId) {
            throw new AppError('You are not authorized to complete this booking', 403);
        }

        if (booking.status !== BookingStatus.ACCEPTED) {
            throw new AppError('Only ACCEPTED bookings can be marked as completed', 400);
        }
        
        if (new Date(booking.scheduledAt) > new Date()) {
            throw new AppError('Cannot complete a booking before its scheduled time', 400);
        }

        const updatedBookingResult = await prisma.$transaction(async (tx) => {
            const updatedBooking = await tx.booking.update({
                where: { id },
                data: { status: BookingStatus.COMPLETED },
                include: {
                    customer: { select: { id: true, name: true, email: true } },
                    service: { include: { category: true } },
                    provider: { select: { name: true } }
                }
            });

            await tx.notification.create({
                data: {
                    userId: updatedBooking.customerId,
                    title: 'Job Completed! ✅',
                    message: `Your ${updatedBooking.service.name} service has been completed by ${updatedBooking.provider?.name}.`
                }
            });

            return updatedBooking;
        });

        return updatedBookingResult;
    }
}

