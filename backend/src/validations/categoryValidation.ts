import { z } from 'zod';

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Category name must be at least 2 characters long'),
        description: z.string().optional(),
    })
});

export const createServiceSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Service name must be at least 2 characters long'),
        description: z.string().optional(),
        price: z.union([
            z.number().positive('Price must be positive'),
            z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number string')
        ])
    }),
    params: z.object({
        categoryId: z.string().uuid('Invalid category ID'),
    })
});
