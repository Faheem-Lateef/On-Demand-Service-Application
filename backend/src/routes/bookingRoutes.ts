import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('CUSTOMER'), createBooking);
router.get('/my-bookings', getMyBookings);
router.patch('/:id/status', restrictTo('ADMIN', 'PROVIDER'), updateBookingStatus);

export default router;
