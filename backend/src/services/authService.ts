import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import AppError from '../utils/appError';
import { RegisterInput, LoginInput } from '../validations/authValidation';

/** Returns a SHA-256 hex digest of the given token string. */
export const hashToken = (token: string): string =>
    crypto.createHash('sha256').update(token).digest('hex');

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

    /** Stores a SHA-256 hash of the issued refresh token in the database. */
    static async storeRefreshToken(userId: string, rawToken: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashToken(rawToken) },
        });
    }

    /**
     * Verifies that the provided raw refresh token matches the stored hash.
     * Throws 401 AppError if the user is not found or the token does not match.
     */
    static async validateRefreshToken(userId: string, rawToken: string): Promise<{ id: string; role: string }> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true, refreshToken: true },
        });

        if (!user || user.refreshToken !== hashToken(rawToken)) {
            throw new AppError('Invalid or expired refresh token', 401);
        }

        return { id: user.id, role: user.role };
    }

    /** Clears the stored refresh token hash, effectively revoking all refresh capability. */
    static async clearRefreshToken(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
}

