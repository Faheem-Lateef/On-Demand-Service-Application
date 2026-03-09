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
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
