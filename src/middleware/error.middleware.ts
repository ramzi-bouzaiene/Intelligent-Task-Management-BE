import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({ error: err.message || 'An error occurred' });
}