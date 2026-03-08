import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError';
import { CategoryService } from '../services/categoryService';

// @desc    Get all categories with their services
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await CategoryService.getCategories();

    res.status(200).json({
        success: true,
        results: categories.length,
        data: categories,
    });
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Admin only)
export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const category = await CategoryService.createCategory(req.body);

    res.status(201).json({
        success: true,
        data: category,
    });
});

// @desc    Create a new service under a category
// @route   POST /api/categories/:categoryId/services
// @access  Private (Admin only)
export const createService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const service = await CategoryService.createService({ ...req.body, categoryId });

    res.status(201).json({
        success: true,
        data: service,
    });
});
