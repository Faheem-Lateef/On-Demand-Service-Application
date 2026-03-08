import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import AppError from '../utils/appError';

export const errorHandler = (
    err: AppError | Error | any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = 500;
    let status = 'error';
    let message = 'Something went very wrong!';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        status = err.status;
        message = err.message;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma database errors
        if (err.code === 'P2002') {
            statusCode = 409;
            status = 'fail';
            const target = (err.meta?.target as string[])?.join(', ') || 'field';
            message = `Unique constraint failed on ${target}. This record already exists.`;
        } else if (err.code === 'P2025') {
            statusCode = 404;
            status = 'fail';
            message = 'Record not found to complete this operation.';
        } else if (err.code === 'P2003') {
            statusCode = 400;
            status = 'fail';
            message = 'Foreign key constraint failed. Related record does not exist.';
        } else {
            statusCode = 400;
            status = 'fail';
            message = `Database query error: ${err.message}`;
        }
    } else {
        // If it's a generic unhandled error
        if (process.env.NODE_ENV === 'development') {
            message = err.message;
        }
    }

    res.status(statusCode).json({
        success: false,
        status,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
