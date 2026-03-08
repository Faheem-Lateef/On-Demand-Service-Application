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

    const createdServices: Record<string, string> = {};

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

        // Fetch created services to map relationships
        const dbServices = await prisma.service.findMany({ where: { categoryId: category.id } });
        dbServices.forEach(s => createdServices[s.name] = s.id);

        console.log(`Category and services created: ${category.name}`);
    }

    // 3. Create Dummy Avatar Providers 
    const providerPassword = await bcrypt.hash('password123', 10);
    const providersToSeed = [
        {
            email: 'john.cleaning@brandspark.com',
            name: 'John the Cleaner',
            avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
            serviceNames: ['Deep Home Cleaning', 'Sofa Cleaning'],
        },
        {
            email: 'mike.repair@brandspark.com',
            name: 'Mike FixIt',
            avatarUrl: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=100&auto=format&fit=crop',
            serviceNames: ['AC Service', 'Plumbing'],
        },
        {
            email: 'sarah.allaround@brandspark.com',
            name: 'Sarah ProServices',
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
            serviceNames: ['Deep Home Cleaning', 'Plumbing'],
        },
        {
            email: 'david.tech@brandspark.com',
            name: 'David Electric & AC',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
            serviceNames: ['AC Service'],
        }
    ];

    for (const p of providersToSeed) {
        const provider = await prisma.user.upsert({
            where: { email: p.email },
            update: {},
            create: {
                email: p.email,
                name: p.name,
                password: providerPassword,
                role: Role.PROVIDER,
                avatarUrl: p.avatarUrl,
            },
        });
        console.log(`Provider created: ${provider.name}`);

        // Currently, our schema maps providers to services *through* bookings (history). 
        // We will seed mock historic bookings to permanently assign them to their specific services
        for (const serviceName of p.serviceNames) {
            const serviceId = createdServices[serviceName];
            if (serviceId) {
                await prisma.booking.create({
                    data: {
                        scheduledAt: new Date(Date.now() - 1000000000), // historical
                        status: 'COMPLETED',
                        totalAmount: 100, // mock historic amount
                        address: '123 Fake Street',
                        customerId: admin.id, // Using the admin as the mock customer
                        providerId: provider.id,
                        serviceId: serviceId
                    }
                });
            }
        }
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
