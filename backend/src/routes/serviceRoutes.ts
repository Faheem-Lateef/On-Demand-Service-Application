import express from 'express';
import { getCategories, createCategory, createService } from '../controllers/serviceController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getCategories);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo('ADMIN'));

router.post('/', createCategory);
router.post('/:categoryId/services', createService);

export default router;
