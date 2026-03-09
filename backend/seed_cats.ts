import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const existingCategories = await prisma.category.findMany();

    const newCategories = ['Plumbing', 'AC Service', 'Electrical Repair', 'Home Cleaning', 'Other'];

    for (const name of newCategories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name }
        });
    }

    const finalCategories = await prisma.category.findMany();
}

main().finally(() => prisma.$disconnect());
