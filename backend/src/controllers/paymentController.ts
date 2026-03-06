import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError';

/**
 * @desc    Simulate a payment processing flow (Bonus Feature)
 * @route   POST /api/payments
 * @access  Private (Customer)
 */
export const processPayment = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId, amount, paymentMethodId } = req.body;

    if (!bookingId || !amount || !paymentMethodId) {
        throw new AppError('Booking ID, amount, and payment method are required', 400);
    }

    // Simulate payment gateway processing delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate 5% chance of payment failure for realism (optional, but let's keep it 100% success for testing)
    const isSuccess = true;

    if (!isSuccess) {
        throw new AppError('Payment declined by the bank', 402); // 402 Payment Required
    }

    // In a real app, you would update the booking's payment status here
    // e.g., await prisma.booking.update({ where: { id }, data: { paymentStatus: 'PAID' } })

    res.status(200).json({
        status: 'success',
        message: 'Payment processed successfully',
        data: {
            transactionId: `txn_mock_${Math.random().toString(36).substring(2, 10)}`,
            amount,
            status: 'PAID'
        }
    });
});
