import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seed started...');

    // 1. Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@brandspark.com' },
        update: {},
        create: {
            email: 'admin@brandspark.com',
            name: 'System Admin',
            password: adminPassword,
            role: Role.ADMIN,
        },
    });
    console.log('Admin user created:', admin.email);

    // 2. Create Categories and Services
    const categories = [
        {
            name: 'Cleaning',
            description: 'Professional home and office cleaning services',
            services: [
                { name: 'Deep Home Cleaning', description: 'Complete house scrub-down', price: 1500 },
                { name: 'Sofa Cleaning', description: 'Expert upholstery cleaning', price: 800 },
            ],
        },
        {
            name: 'Repair',
            description: 'Home appliance and hardware repairs',
            services: [
                { name: 'AC Service', description: 'Routine AC maintenance', price: 1200 },
                { name: 'Plumbing', description: 'Leaky pipes and fixture fixes', price: 500 },
            ],
        },
    ];

    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: {
                name: cat.name,
                description: cat.description,
                services: {
                    create: cat.services,
                },
            },
        });
        console.log(`Category and services created: ${category.name}`);
    }

    console.log('Seed finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
