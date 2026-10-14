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

// Allowed origins list
const allowedOrigins = new Set([
  ...(env.clientUrls || []),
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://0.0.0.0:3000',
  'http://0.0.0.0:3001',
  'https://shotconnect-20yo.vercel.app'
]);

const isAllowedOrigin = (origin: string | undefined): boolean => {
  // Postman ya server-to-server calls ke liye
  if (!origin) return true;

  if (allowedOrigins.has(origin)) return true;

  // Saare *.vercel.app domains aur local IPs ko allow karein
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
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie']
};

// CORS middleware apply karein
app.use(cors(corsOptions));

// Preflight OPTIONS requests handle karein
app.options('*', cors(corsOptions));

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