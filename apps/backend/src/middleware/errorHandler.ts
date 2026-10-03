import type { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(sendError(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (
  err: Error & { statusCode?: number; errors?: string[] },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json(sendError(message, err.errors || []));
};
