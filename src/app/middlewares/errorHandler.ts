import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../constants';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  console.error(`ERROR: ${req.method} ${req.url}:`, (err as Error)?.message || err);
  if (!res.headersSent) {
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
  next(err);
}
