import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

async function main() {
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

    // 2. Create Categories and Services
    const categories = [
        {
            name: 'Cleaning',
            description: 'Professional home and office cleaning services',
            services: [
                { name: 'Deep Home Cleaning', description: 'Complete house scrub-down', price: 1500 },
                { name: 'Sofa Cleaning', description: 'Expert upholstery cleaning', price: 800 },
                { name: 'Office Cleaning', description: 'Monthly office maintenance', price: 3000 },
            ],
        },
        {
            name: 'Repair',
            description: 'Home appliance and hardware repairs',
            services: [
                { name: 'AC Service', description: 'Routine AC maintenance', price: 1200 },
                { name: 'Washing Machine Repair', description: 'Fixing drum and motor issues', price: 1000 },
                { name: 'Refrigerator Repair', description: 'Gas refill and compressor fixes', price: 1500 },
            ],
        },
        {
            name: 'Plumbing',
            description: 'Residential and commercial plumbing solutions',
            services: [
                { name: 'Leaky Pipe Fix', description: 'Fixing minor leaks in faucets and pipes', price: 400 },
                { name: 'Drainage Unclogging', description: 'Clearing blocked kitchen or bath drains', price: 600 },
                { name: 'Bathroom Fitting', description: 'Installing new taps and shower heads', price: 1000 },
            ],
        },
        {
            name: 'Electrician',
            description: 'Safe and certified electrical work',
            services: [
                { name: 'Fan Installation', description: 'Fitting and wiring ceiling fans', price: 500 },
                { name: 'Custom Wiring', description: 'New socket points and internal wiring', price: 1500 },
                { name: 'Switchboard Repair', description: 'Fixing faulty switches', price: 300 },
            ],
        },
        {
            name: 'Painting',
            description: 'Interior and exterior home painting',
            services: [
                { name: 'Interior Wall Painting', description: 'Single wall or full room painting', price: 5000 },
                { name: 'Wood Polishing', description: 'Restore furniture and doors', price: 2000 },
            ],
        },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
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
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
