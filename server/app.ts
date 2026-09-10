import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes';
import { sendError } from './utils/response';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disabled in development/iframe preview
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    })
  );

  // Request body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request tracing & logging
  app.use(requestLogger);

  // Mount API modular monolith router
  app.use('/api', apiRouter);

  // API 404 Catch-all
  app.use('/api', (req, res) => {
    sendError(res, `API route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND');
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
