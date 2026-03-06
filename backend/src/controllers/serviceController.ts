import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../utils/prisma';
import AppError from '../utils/appError';

// @desc    Get all categories with their services
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
        include: {
            services: true,
        },
    });

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
    const { name, description } = req.body;

    if (!name) {
        return next(new AppError('Category name is required', 400));
    }

    const category = await prisma.category.create({
        data: {
            name,
            description,
        },
    });

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
    const { name, description, price } = req.body;

    if (!name || !price) {
        return next(new AppError('Service name and price are required', 400));
    }

    const service = await prisma.service.create({
        data: {
            name,
            description,
            price: Number(price),
            categoryId: categoryId as string,
        },
    });

    res.status(201).json({
        success: true,
        data: service,
    });
});
