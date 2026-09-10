import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types';

export function requestLogger(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(2, 11);
  req.requestId = requestId;

  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    console.log(`[${new Date().toISOString()}] [${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
  });

  next();
}
