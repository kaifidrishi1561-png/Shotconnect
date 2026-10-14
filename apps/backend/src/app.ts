import express from 'express';
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

// Allowed origins
const allowedOrigins = new Set([
  ...(env.clientUrls || []),
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://0.0.0.0:3000',
  'http://0.0.0.0:3001',
  'https://shotconnect-20yo.vercel.app',
  'https://shotconnect-29ye.vercel.app'
]);

const isAllowedOrigin = (origin: string | undefined): boolean => {
  // Mobile apps, Postman ya curl calls
  if (!origin) return true;

  if (allowedOrigins.has(origin)) return true;

  // Har Vercel preview/production URL ko allow karein
  if (origin.endsWith('.vercel.app')) return true;

  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    );
  } catch {
    return false;
  }
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      // Allowed hone par request origin reflect karein
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Cookie',
    'X-Requested-With'
  ],
  optionsSuccessStatus: 204
};

// 1. CORS apply karein
app.use(cors(corsOptions));

// 2. Explicit Preflight OPTIONS Handler (CORS error permanently stop karne ke liye)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Accept, Cookie, X-Requested-With'
    );
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

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
    servers: [{ url: `http://localhost:${env.port}` }]
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