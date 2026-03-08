import prisma from '../utils/prisma';

export class CategoryService {
    static async getCategories() {
        return await prisma.category.findMany({
            include: {
                services: true,
            },
        });
    }

    static async createCategory(data: { name: string; description?: string }) {
        return await prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
            },
        });
    }

    static async createService(data: { name: string; description?: string; price: number | string; categoryId: string }) {
        return await prisma.service.create({
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                categoryId: data.categoryId,
            },
        });
    }
}
