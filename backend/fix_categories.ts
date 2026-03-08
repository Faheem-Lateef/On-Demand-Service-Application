/// <reference types="node" />
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

async function fix() {
    console.log("Fixing categories...");
    const categories = ['Plumbing', 'AC Service', 'Electrical', 'Cleaning', 'Other'];
    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name }
        });
        console.log("Upserted:", name);
    }
}

fix()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
