import express from 'express';
import { processPayment } from '../controllers/paymentController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// Only authenticated customers should process payments (or realistically anyone who booked)
router.use(protect);

router.post('/', restrictTo('CUSTOMER'), processPayment);

export default router;
