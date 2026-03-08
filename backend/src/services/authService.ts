import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import AppError from '../utils/appError';
import { RegisterInput, LoginInput } from '../validations/authValidation';

export class AuthService {
    static async registerUser(data: RegisterInput) {
        const { name, email, password, role, categoryId } = data;

        // Prevent users from making themselves ADMIN during open registration
        const assignedRole = role === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            throw new AppError('Email already in use', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: assignedRole,
                categoryId: assignedRole === 'PROVIDER' ? categoryId : null,
                providerStatus: assignedRole === 'PROVIDER' ? 'PENDING' : null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                categoryId: true,
                providerStatus: true,
                category: { select: { id: true, name: true } }
            },
        });

        return user;
    }

    static async loginUser(data: LoginInput) {
        const { email, password } = data;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError('Incorrect email or password', 401);
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            categoryId: user.categoryId
        };
    }
}
