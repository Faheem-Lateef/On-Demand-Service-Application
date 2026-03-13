import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorMiddleware';
import AppError from './utils/appError';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
// Routers
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import serviceRoutes from './routes/serviceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common'));

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:8081'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Security: Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 45 * 60 * 1000, // 45 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('On-Demand Service API is running');
});

// 404 Route Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware (must be exactly 4 arguments)
app.use(errorHandler);

export { app };

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
