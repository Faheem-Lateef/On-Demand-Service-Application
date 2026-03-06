import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

export const errorHandler = (
    err: AppError | Error,
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
    } else {
        // If it's a generic error (e.g. database unhandled fail, syntax error)
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
