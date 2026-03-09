import express from 'express';
import { getMe, getAllUsers, getProviders, getProviderBookings, getPendingProviders, approveProvider, rejectProvider, deleteUser } from '../controllers/userController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes (open to all users)
router.get('/providers', getProviders);

// All routes below this line will be protected (require valid JWT)
router.use(protect);

router.get('/me', getMe);
router.get('/provider-bookings', restrictTo('PROVIDER', 'ADMIN'), getProviderBookings);

// Only admins can access these routes
router.get('/providers/pending', restrictTo('ADMIN'), getPendingProviders);
router.patch('/providers/:id/approve', restrictTo('ADMIN'), approveProvider);
router.patch('/providers/:id/reject', restrictTo('ADMIN'), rejectProvider);

router.get('/', restrictTo('ADMIN'), getAllUsers);
router.delete('/:id', restrictTo('ADMIN'), deleteUser);

export default router;
