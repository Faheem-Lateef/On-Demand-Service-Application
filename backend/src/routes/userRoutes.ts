import express from 'express';
import { getMe, getAllUsers, getProviders, getProviderBookings } from '../controllers/userController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// All routes below this line will be protected (require valid JWT)
router.use(protect);

router.get('/me', getMe);
router.get('/providers', getProviders);
router.get('/provider-bookings', restrictTo('PROVIDER', 'ADMIN'), getProviderBookings);

// Only admins can access these routes
router.get('/', restrictTo('ADMIN'), getAllUsers);

export default router;
