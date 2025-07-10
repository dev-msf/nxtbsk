import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation error', details: err.issues });
  }
  // prisma error
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Prisma Resource not found' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
} 