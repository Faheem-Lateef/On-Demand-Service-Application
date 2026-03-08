import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus, acceptBooking, rejectBooking } from '../controllers/bookingController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { validate, createBookingSchema, updateBookingStatusSchema, bookingIdParamSchema } from '../validations/bookingValidation';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('CUSTOMER'), validate(createBookingSchema), createBooking);
router.get('/my-bookings', getMyBookings);
router.patch('/:id/status', restrictTo('ADMIN', 'PROVIDER'), validate(updateBookingStatusSchema), updateBookingStatus);
router.patch('/:id/accept', restrictTo('PROVIDER', 'ADMIN'), validate(bookingIdParamSchema), acceptBooking);
router.patch('/:id/reject', restrictTo('PROVIDER', 'ADMIN'), validate(bookingIdParamSchema), rejectBooking);

export default router;
