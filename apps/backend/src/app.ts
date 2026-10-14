import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { env } from './config/env';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import photographerRoutes from './routes/photographerRoutes';
import profileRoutes from './routes/profileRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// 1. CORS Origin Checker
const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true; // Postman / server-to-server calls

  // Sabhi vercel.app domains ko allow karein
  if (origin.endsWith('.vercel.app')) return true;

  // Localhost aur private IPs
  if (
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('0.0.0.0') ||
    origin.startsWith('http://192.168.') ||
    origin.startsWith('http://10.') ||
    origin.startsWith('http://172.')
  ) {
    return true;
  }

  // env me diye gaye URLs
  if (env.clientUrls && env.clientUrls.includes(origin)) {
    return true;
  }

  return false;
};

// 2. Custom Bulletproof CORS & Preflight Middleware (Sabse pehle aana chahiye)
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie'
    );
  }

  // Preflight OPTIONS request ko yahi par 204 No Content ke sath khatam karein
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// Helmet ko configure karein taaki Cross-Origin block na kare
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs || 900000,
    max: env.rateLimitMaxRequests || 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShotMatch API',
      version: '1.0.0',
      description: 'API documentation for the ShotMatch marketplace.'
    },
    servers: [{ url: `http://localhost:${env.port || 8000}` }]
  },
  apis: ['./src/routes/*.ts']
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API healthy', data: { status: 'ok' } });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/photographers', photographerRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;