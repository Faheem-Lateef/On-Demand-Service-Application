import express from 'express';
import { getCategories, createCategory, createService, deleteCategory, deleteService } from '../controllers/serviceController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

import { validate } from '../validations/validate';
import { createCategorySchema, createServiceSchema } from '../validations/categoryValidation';

const router = express.Router();

// Public routes
router.get('/', getCategories);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo('ADMIN'));

router.post('/', validate(createCategorySchema), createCategory);
router.post('/:categoryId/services', validate(createServiceSchema), createService);

router.delete('/:id', deleteCategory);
router.delete('/services/:serviceId', deleteService);

export default router;
