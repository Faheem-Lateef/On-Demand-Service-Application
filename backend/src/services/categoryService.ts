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

    static async deleteCategory(categoryId: string) {
        // We delete the services sequentially, or rely on onDelete: Cascade.
        // It's safer to delete child services manually if cascade isn't strictly declared or we want to double check.
        await prisma.service.deleteMany({ where: { categoryId } });
        return await prisma.category.delete({ where: { id: categoryId } });
    }

    static async deleteService(serviceId: string) {
        return await prisma.service.delete({ where: { id: serviceId } });
    }
}
